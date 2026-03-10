import { ScatterplotLayer, ScatterplotLayerProps } from '@deck.gl/layers';
import { DefaultProps, UpdateParameters } from '@deck.gl/core';

// Shader module para el tiempo
const timeShaderModule = {
  name: 'time-module',
  vs: `uniform float time;`,
  fs: `uniform float time;`,
  getUniforms: (opts: { time?: number }) => {
    if (opts && opts.time !== undefined) {
      return { time: opts.time };
    }
    return {};
  },
};

export type PulsingRadarLayerProps<DataT = unknown> =
  ScatterplotLayerProps<DataT> & {
    time?: number;
  };

const defaultProps: DefaultProps<PulsingRadarLayerProps> = {
  time: { type: 'number', value: 0 },
};

export class PulsingRadarLayer<DataT = unknown> extends ScatterplotLayer<
  DataT,
  PulsingRadarLayerProps<DataT>
> {
  static layerName = 'PulsingRadarLayer';
  static defaultProps = defaultProps;

  getShaders() {
    const shaders = super.getShaders();

    shaders.modules = [...(shaders.modules || []), timeShaderModule];

    shaders.inject = {
      // Vertex Shader: Controla el tamaño (pulso)
      'vs:DECKGL_FILTER_SIZE': `
        float pulse = sin(time * 4.0) * 0.5 + 0.5;
        size = size * (1.0 + pulse * 0.5); 
      `,

      // Fragment Shader: Controla el color y transparencia
      'fs:DECKGL_FILTER_COLOR': `
        float distToCenter = length(geometry.uv);
        float ring = smoothstep(0.4, 0.8, distToCenter) - smoothstep(0.8, 1.0, distToCenter);
        float pulseAlpha = sin(time * 4.0) * 0.5 + 0.5;
        color.a *= ring * (1.0 - pulseAlpha * 0.6) * 2.0;
      `,
    };

    return shaders;
  }

  updateState(params: UpdateParameters<this>) {
    super.updateState(params);

    const { time = 0 } = params.props;

    for (const model of this.getModels()) {
      if (model && model.shaderInputs) {
        model.shaderInputs.setProps({
          'time-module': { time },
        });
      }
    }
  }
}
