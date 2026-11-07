import type {Episode, NarrativeCondition, NarrativeNode, StoryState} from '../types';

export type NarrativeContext = {
  relationships: Record<string, number>;
  flags: Set<string>;
};

/** Rebuild consequences from choices, including saved games from older versions. */
export function narrativeContext(episode: Episode, state: StoryState): NarrativeContext {
  const context: NarrativeContext = {relationships: {}, flags: new Set()};
  for (const entry of state.history) {
    const choice = episode.nodes[entry.sceneId]?.choices?.find(item => item.id === entry.id);
    for (const [character, change] of Object.entries(choice?.effects?.relationships ?? {})) {
      context.relationships[character] = (context.relationships[character] ?? 0) + change;
    }
    for (const flag of choice?.effects?.flags ?? []) context.flags.add(flag);
  }
  return context;
}

export function meetsCondition(context: NarrativeContext, condition: NarrativeCondition): boolean {
  if (condition.flags?.some(flag => !context.flags.has(flag))) return false;
  if (condition.withoutFlags?.some(flag => context.flags.has(flag))) return false;
  const relation = condition.relationship;
  if (!relation) return true;
  const value = context.relationships[relation.character] ?? 0;
  return (relation.atLeast === undefined || value >= relation.atLeast)
    && (relation.atMost === undefined || value <= relation.atMost);
}

/** Content varies while node identifiers and the authored graph remain stable. */
export function resolveScene(episode: Episode, state: StoryState): NarrativeNode {
  const node = episode.nodes[state.nodeId] ?? episode.nodes[episode.start];
  const context = narrativeContext(episode, state);
  const variation = node.variations?.find(item => meetsCondition(context, item.when));
  if (!variation) return node;
  const {when: _condition, ...content} = variation;
  return {...node, ...content};
}
