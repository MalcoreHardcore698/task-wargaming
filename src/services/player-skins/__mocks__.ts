import guisePersonalIcon from "@/assets/svg/guise-personal-c.svg";
import guiseNationalIcon from "@/assets/svg/guise-national-c.svg";
import effectHornIcon from "@/assets/images/icons/icon-effect-horn.png";
import effectLegendaryIcon from "@/assets/images/icons/icon-effect-legendary.png";
import effectTracerIcon from "@/assets/images/icons/icon-effect-tracer.png";
import effectVoiceoverIcon from "@/assets/images/icons/icon-effect-voiceover.png";
import henkPropperPortrait from "@/assets/images/skins/portraits/henk-propper-mini.png";
import henkPropperSplash from "@/assets/images/skins/henk-propper.png";
import alexanderGromovPortrait from "@/assets/images/skins/portraits/alexander-gromov-mini.png";
import alexanderGromovSplash from "@/assets/images/skins/alexander-gromov.png";
import angelaLuttiPortrait from "@/assets/images/skins/portraits/angela-lutti-mini.png";
import angelaLuttiSplash from "@/assets/images/skins/angela-lutti.png";
import poseidonPortrait from "@/assets/images/skins/portraits/poseidon-mini.png";
import poseidonSplash from "@/assets/images/skins/poseidon.png";
import athenaPortrait from "@/assets/images/skins/portraits/athena-mini.png";
import athenaSplash from "@/assets/images/skins/athena.png";
import baradunPortrait from "@/assets/images/skins/portraits/baradun-mini.png";
import baradunSplash from "@/assets/images/skins/baradun.png";
import blacksmithPortrait from "@/assets/images/skins/portraits/blacksmith-mini.png";
import blacksmithSplash from "@/assets/images/skins/blacksmith.png";
import farmerPortrait from "@/assets/images/skins/portraits/farmer-mini.png";
import farmerSplash from "@/assets/images/skins/farmer.png";
import zeusPortrait from "@/assets/images/skins/portraits/zeus-mini.png";
import zeusSplash from "@/assets/images/skins/zeus.png";

import type { TPlayerSkin, TPlayerSkinGuise, TPlayerSkinEffect } from "./types";

export const PLAYER_SKIN_GUISES: TPlayerSkinGuise[] = [
  {
    type: "general" as const,
    icon: guisePersonalIcon,
    label: "GENERAL GUISE",
    description:
      "Guise can only be applied to Commanders from specific nations.",
  },
  {
    type: "national" as const,
    icon: guiseNationalIcon,
    label: "NATIONAL GUISE",
    description: "Guise can only be applied to Commanders",
  },
];

export const PLAYER_SKIN_EFFECTS: TPlayerSkinEffect[] = [
  {
    id: "signal-flare",
    icon: effectHornIcon,
    title: "Signal Flare",
    description: "Use the horn to launch a signal flare in battle",
  },
  {
    id: "legendary-skill",
    icon: effectLegendaryIcon,
    title: "Legendary Skill Effect",
    description: "Add a visual effect for legendary skill activation in battle",
  },
  {
    id: "tinted-tracers",
    icon: effectTracerIcon,
    title: "Tinted Tracers",
    description: "Add tinted shell tracers",
  },
  {
    id: "voiceover",
    icon: effectVoiceoverIcon,
    title: "Voiceover",
    description: "Add unique voiceover",
  },
];

export const PLAYER_SKINS: TPlayerSkin[] = [
  {
    id: "henk-propper",
    name: "Henk Pröpper",
    rank: "LEGENDARY COMMANDER",
    level: 16,
    description: "Original commander without special effects.",
    portrait: henkPropperPortrait,
    splashImage: henkPropperSplash,
    effects: [],
  },
  {
    id: "alexander-gromov",
    name: "Alexander Gromov",
    rank: "LEGENDARY COMMANDER",
    level: 16,
    description: "Skin with thematic design and unique effects.",
    portrait: alexanderGromovPortrait,
    splashImage: alexanderGromovSplash,
    effects: PLAYER_SKIN_EFFECTS.slice(0, 2),
  },
  {
    id: "angela-lutti",
    name: "Angela Lutti",
    rank: "LEGENDARY COMMANDER",
    level: 16,
    description: "Skin with thematic design and unique effects.",
    portrait: angelaLuttiPortrait,
    splashImage: angelaLuttiSplash,
    effects: PLAYER_SKIN_EFFECTS.slice(0, 2),
  },
  {
    id: "poseidon",
    name: "Poseidon",
    rank: "LEGENDARY COMMANDER",
    level: 16,
    description: "Unique skin for a commander with visual and audio effects.",
    portrait: poseidonPortrait,
    splashImage: poseidonSplash,
    effects: PLAYER_SKIN_EFFECTS.slice(0, 2),
  },
  {
    id: "athena",
    name: "Athena",
    rank: "LEGENDARY COMMANDER",
    level: 16,
    description: "Skin with thematic design and unique effects.",
    portrait: athenaPortrait,
    splashImage: athenaSplash,
    effects: PLAYER_SKIN_EFFECTS,
  },
  {
    id: "baradun",
    name: "Baradun",
    rank: "LEGENDARY COMMANDER",
    level: 16,
    description: "Skin with thematic design and unique effects.",
    portrait: baradunPortrait,
    splashImage: baradunSplash,
    effects: PLAYER_SKIN_EFFECTS,
  },
  {
    id: "blacksmith",
    name: "Blacksmith",
    rank: "LEGENDARY COMMANDER",
    level: 16,
    description: "Skin with thematic design and unique effects.",
    portrait: blacksmithPortrait,
    splashImage: blacksmithSplash,
    effects: PLAYER_SKIN_EFFECTS,
  },
  {
    id: "farmer",
    name: "Farmer",
    rank: "LEGENDARY COMMANDER",
    level: 16,
    description: "Skin with thematic design and unique effects.",
    portrait: farmerPortrait,
    splashImage: farmerSplash,
    effects: PLAYER_SKIN_EFFECTS,
  },
  {
    id: "zeus",
    name: "Zeus",
    rank: "LEGENDARY COMMANDER",
    level: 16,
    description: "Skin with powerful visual effects and voiceover.",
    portrait: zeusPortrait,
    splashImage: zeusSplash,
    effects: PLAYER_SKIN_EFFECTS,
  },
];
