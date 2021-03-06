import * as m from 'mithril'
import Game from '../models/game'


interface Attrs {
  game: App.GameState
}

interface State {
  selected: null | App.UnitId
}


export default {
  oninit(vnode) {
    vnode.state.selected = null
  },
  view(vnode) {
    var game = vnode.attrs.game

    return m('.map',

      Object.keys(game.units).map( unitId =>
        game.units[unitId] && renderUnit(game, game.units[unitId])
      )
    )
  }
} as m.Component<Attrs, State>


function renderUnit (game: App.GameState, unit: App.Unit) {
  var pos = unit.pos
  var unitSize = unit.size * 2 // unit.size is radius

  var style = {
    transform: `translate(${ pos.x }px, ${ pos.y }px)`,
    width: unitSize + 'px',
    height: unitSize + 'px',
    lineHeight: unitSize + 'px',
  }

  var hp = {
    max: { width: `${unitSize - 6}px`, left: '3px' },
    current: { width: `${unit.currentHp / unit.maxHp * 100}%` },
  }

  return m('.unit', Game.focus(unit.id, { style: style, class: unit.type }),

    m('.bar-max', { style: hp.max }, m('.bar', { style: hp.current })),

    unit.name[0].toUpperCase()
  )
}
