export type TechLevel = "core" | "proficient" | "familiar";
export interface Tech {
  name: string;
  icon: string;
  level: TechLevel;
}

export interface PortfolioData {
  techs: Tech[];
}