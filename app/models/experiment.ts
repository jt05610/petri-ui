import { z } from "zod";

export enum ExperimentType {
  lhs = "lhs",
  fullFactorial = "full",
  boxBehnken = "box",
  plackettBurman = "plackett",
}

interface ExperimentDimension {
  name: string;
}

export interface NumberDimension extends ExperimentDimension {
  axis: {
    min: number;
    max: number;
    step: number;
  };
}

export interface CategoricalDimension extends ExperimentDimension {
  values: (string | number)[];
}

interface ExperimentDesign {
  kind: ExperimentType;
  axes: ExperimentDimension[];
}

interface LHSDesign extends ExperimentDesign {
  kind: ExperimentType.lhs;
  n_samples: number;
  id_stem: string;
  strength: number;
}

export function makeLHSDesign(n_samples: number, id_stem: string, strength: number, axes: ExperimentDimension[]): LHSDesign {
  return {
    kind: ExperimentType.lhs,
    n_samples,
    id_stem,
    strength,
    axes
  };
}

export const NumberAxisSchema = z.object({
  min: z.preprocess((x) => {
    if (typeof x === "string") {
      return parseFloat(x);
    }
    return x;
  }, z.number()),
  max: z.preprocess((x) => {
    if (typeof x === "string") {
      return parseFloat(x);
    }
    return x;
  }, z.number()),
  step: z.preprocess((x) => {
    if (typeof x === "string") {
      return parseFloat(x);
    }
    return x;
  }, z.number())
});

export type NumberAxis = z.infer<typeof NumberAxisSchema>;

const CategoricalAxisSchema = z.array(z.string());

export type CategoricalAxis = z.infer<typeof CategoricalAxisSchema>;

export const AxisSchema = z.object({
  name: z.string(),
  values: CategoricalAxisSchema.optional(),
  axis: NumberAxisSchema.optional()
});

export type Axis = z.infer<typeof AxisSchema>;

export const ExperimentSchema = z.object({
  kind: z.nativeEnum(ExperimentType),
  axes: z.array(AxisSchema),
  n_samples: z.preprocess((x) => {
      if (typeof x === "string") {
        return parseInt(x);
      }
      return x;
    },
    z.number().int().positive()),
  strength: z.preprocess((x) => {
      if (typeof x === "string") {
        return parseInt(x);
      }
      return x;
    }
    , z.number().int().positive()),
  id_stem: z.string().optional()
});

export type ExperimentDesignType = z.infer<typeof ExperimentSchema>;

export type ExperimentSample = {
  id: string;
  name: string;
  group: string;
} & Record<string, number | string>

export type ExperimentDesignResult = ExperimentSample[]
