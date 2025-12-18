
import { Scene, RetentionPoint, WorkflowPhase } from './types';

export const FILM_TITLE = "BURNING VOWS";

export const RETENTION_DATA: RetentionPoint[] = [
  { time: 0, retention: 100, label: "Hook Start" },
  { time: 1, retention: 85, label: "Initial Drop" },
  { time: 3, retention: 78, label: "Chapter 2 Break" },
  { time: 6, retention: 82, label: "Mini Hook #1" },
  { time: 10, retention: 75, label: "Mid-point Bridge" },
  { time: 15, retention: 72, label: "Tension Peak" },
  { time: 20, retention: 74, label: "Mini Hook #2" },
  { time: 25, retention: 68, label: "Climax Entry" },
  { time: 30, retention: 65, label: "End Screen" },
];

export const SCENES: Scene[] = [
  {
    id: 1,
    timestamp: "00:00",
    title: "The Argument [Hook]",
    duration: 180,
    pacing: "Fast-paced (cuts every 2-3s)",
    retentionHook: "Broken glass hitting floor in first 5s",
    cardOpportunity: "Link to Trailer Part 1",
    seoMoment: "Keyword: 'Marriage Conflict'",
    shotStrategy: "Handheld close-ups for intimacy and stress",
    description: "Sarah and Mark reach a breaking point over a hidden phone message. This establishes the central mystery."
  },
  {
    id: 2,
    timestamp: "03:00",
    title: "How We Got Here",
    duration: 180,
    pacing: "Slow burn with jump cuts",
    retentionHook: "Flashback teaser showing a mysterious character",
    cardOpportunity: "N/A",
    seoMoment: "Keyword: 'Relationship Betrayal'",
    shotStrategy: "Warm lighting vs Cold present day",
    description: "We see the happy couple 1 year ago. Flashbacks are edited with quick 'shutter' transitions to keep energy high."
  },
  {
    id: 3,
    timestamp: "06:00",
    title: "Newlywed Problems",
    duration: 240,
    pacing: "Moderate with reaction shots",
    retentionHook: "Sarah confronts Mark's mother",
    cardOpportunity: "Link to 'Mother-in-law Drama' playlist",
    seoMoment: "Keyword: 'Marriage Problems'",
    shotStrategy: "Over-the-shoulder for claustrophobic feel",
    description: "The interference of family starts showing cracks in the foundation. Essential for long-term watch time."
  },
  {
    id: 4,
    timestamp: "10:00",
    title: "The First Secret",
    duration: 180,
    pacing: "Staccato editing",
    retentionHook: "Mark's phone rings with a nameless contact",
    cardOpportunity: "N/A",
    seoMoment: "Keyword: 'Hidden Secrets'",
    shotStrategy: "Low-angle shots to give Mark power/suspicion",
    description: "Mark hides his phone, triggering Sarah's suspicion. High-tension dialogue sequence."
  }
];

export const PHASES = [
  {
    title: WorkflowPhase.ASSEMBLY,
    tasks: ["Edit 10% faster than theatrical", "Identify retention peaks", "Marker scene changes"]
  },
  {
    title: WorkflowPhase.RETENTION,
    tasks: ["Insert mini-hooks every 3m", "Tighten emotional pauses", "Add 'Next Chapter' teasers"]
  },
  {
    title: WorkflowPhase.OPTIMIZATION,
    tasks: ["Place info cards at 6m and 12m", "Create 20s end-screen buffer", "Color grade for small screens"]
  }
];
