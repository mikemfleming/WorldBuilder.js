
declare namespace App {
  export type UnitId = string

  interface UnitBase {
    id: UnitId,
    name: string,
    size: number,
    pos: { x: number, y: number },
    currentHp: number,
    maxHp: number,
    stats: {
      resilience: number,
      speed: number,
      str: number,
      range: number,
    }
  }


  export type Unit = Player | Enemy
  export type Player = { type: 'player' } & UnitBase
  export type Enemy  = { type: 'enemy', aiType: null | string } & UnitBase

  type TimelinePos
    = {
        type: 'wait',
        value: number, // 0 is decision time
      }
    | {
        type: 'act',
        step: number, // This increments once per frame
        limit: number, // The max number of steps before the action gets cancelled
      }
  type Timeline = Record<UnitId, TimelinePos>

  export type UserInput
    = { type: 'decision', pendingDecisionId: string, action: BattleAction }

  export type BattleAction
    = { type: 'attack', targetId: UnitId }


  type ActionState
    = {
        type: 'passive'
      }
    | {
        type: 'target',
        target: UnitId,
        action: 'move' | 'attack' | 'cast' | 'defend'
      }
    | {
        type: 'retreat',
        pos: { x: number, y: number }
      }

  export type PendingDecision = {
    id: string, // Useful for mitigating potential slow network issues
    action: null | string, // When a player makes a decision, this gets filled.
  }

  export interface GameState {
    frame: number,
    mode: 'battle' | 'explore'
    map: {
      width: number,
      height: number,
    },
    units: Record<UnitId, Unit>,

    // number is where they are on timeline
    timeline: Timeline,

    //
    // This is the point that units will retreat towards
    // when they have leftover action points during battle.
    //
    retreatPoints: Record<UnitId, { x: number, y: number }>

    //
    // During battle, the game pauses as long as there is a decision to be made.
    //
    pendingDecisions: Record<UnitId, PendingDecision>,

    intents: Record<UnitId, ActionState>

    inputs: Record<UnitId, UserInput>,

    meta: {
      timelineWaitSize: number,
      fps: number,
    }
  }

  export type Effect
    = {
        type: 'invalid-action',
        message: string,
      }
    | {
        type: 'battle:decision',
        actorId: UnitId,
        targetId?: UnitId,
        action: 'attack'
      }
    | {
        type: 'battle:hp',
        actorId: UnitId,
        targetId: UnitId,
        mod: number, // negative for damage, positive for heal, zero for miss.
      }

  export type Step = { game: GameState, effects: Effect[] }
}
