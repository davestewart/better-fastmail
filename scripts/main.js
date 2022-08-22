// ---------------------------------------------------------------------------------------------------------------------
// storage
// ---------------------------------------------------------------------------------------------------------------------

const Storage = {
  get (key) {
    const value = localStorage.getItem(key)
    if (typeof value !== undefined) {
      return JSON.parse(value)
    }
  },

  set (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },

  clear () {
    localStorage.clear()
  },
}

// ---------------------------------------------------------------------------------------------------------------------
// dom
// ---------------------------------------------------------------------------------------------------------------------

const isInput = (event) => /INPUT|TEXTAREA/i.test(event.target.tagName)

const $ = document.querySelector.bind(document)

const $$ = document.querySelectorAll.bind(document)

function $t (parent, text, selector = undefined) {
  if (typeof parent === 'string') {
    parent = $(parent)
  }
  if (parent) {
    const elements = selector
      ? parent.querySelectorAll(selector)
      : parent.childNodes
    return Array.from(elements).find(e => e.innerText === text)
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// keyboard
// ---------------------------------------------------------------------------------------------------------------------

const isMac = /mac/i.test(navigator.platform)

const isModifier = (event) => isMac ? event.metaKey : event.ctrlKey

const getKey = (event) => {
  const { key } = event
  const map = {
    ' ': 'Space',
    'Esc': 'Escape',
  }
  return map[key] || key
}

function getCombo (event) {
  let prefix = ''
  if (event.altKey) {
    prefix += 'Alt'
  }
  if (event.shiftKey) {
    prefix += 'Shift'
  }
  if (isModifier(event)) {
    prefix += 'Mod'
  }
  return prefix + getKey(event).replace(/Alt|Shift|Control|Meta/, '')
}

function parseCombo (combo = '') {
  return combo.split('+').reduce(function (options, part) {
    if (/Mod/i.test(part)) {
      options[(isMac ? 'meta' : 'ctrl') + 'Key'] = true
    }
    else if (/Shift|Alt|Ctrl|Meta/i.test(part)) {
      options[part.toLowerCase() + 'Key'] = true
    }
    else {
      options.key = part.toUpperCase()
    }
    return options
  }, {})
}

// ---------------------------------------------------------------------------------------------------------------------
// shortcuts
// ---------------------------------------------------------------------------------------------------------------------

function fireShortcut (combo) {
  const options = parseCombo(combo)
  document.dispatchEvent(new KeyboardEvent('keydown', options))
}

function handleShortcut (combo, filter = null) {
  return function (event) {
    if (!filter || filter()) {
      event.preventDefault()
      fireShortcut(combo)
      return true
    }
  }
}

function handleListShortcut (combo) {
  const filter = () => $('#mail .v-Mailbox, #contacts .u-list-body')
  return handleShortcut(combo, filter)
}

function handleListDelete (event) {
  if($('#mail .v-Mailbox')) {
    event.preventDefault()
    return fireShortcut('D')
  }
  else if ($('#contacts .u-list-body')) {
    event.preventDefault()
    return fireShortcut('#')
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// selection
// ---------------------------------------------------------------------------------------------------------------------

function getDeselectItemsCheckbox () {
  return $('.v-SelectAllCheckbox.is-checked')
}

function getSelectedItem () {
  const focus = $('div[class="v-ListKBFocus"]')
  if (focus) {
    const top = focus.style.marginTop
    return $(`.u-list-item[style*="top:${top}"]`)
  }
  else {
    return $('.v-MailboxItem.is-focused, .v-ContactItem.is-focused')
  }
}

function getSelectedState (el) {
  return el.classList.contains('is-selected')
}

function getSelectionOperation (src, trg, dir) {
  // @see https://stackoverflow.com/questions/8902270/is-element-before-or-after-another-element-in-dom
  const before = src.compareDocumentPosition(trg) & Node.DOCUMENT_POSITION_PRECEDING
  return !!before
    ? dir < 0
    : dir > 0
}

function selectItem (el, select) {
  const isSelected = getSelectedState(el)
  if ((select && !isSelected) || (!select && isSelected)) {
    el.click()
  }
}

function handleSelectItem (dir) {
  return function (event) {
    const src = getSelectedItem()
    if (src) {
      const trg = dir < 0
        ? src.previousSibling
        : src.nextSibling
      if (trg) {
        event.preventDefault()

        // variables
        const isStart = !selectionAnchor
        const isEnd = trg === selectionAnchor

        // first selection (src)
        if (isStart) {
          selectionAnchor = src
          if (!getSelectedState(src)) {
            fireShortcut('X')
          }
        }

        // move to next item (trg)
        fireShortcut(dir < 0 ? 'K' : 'J')

        // first selection
        if (isStart) {
          selectItem(trg, true)
        }

        // returning to anchor
        else if (isEnd) {
          selectItem(src, false)
          selectItem(trg, false)
          selectionAnchor = null
        }

        // any other selection
        else {
          const shouldSelect = getSelectionOperation(selectionAnchor, trg, dir)
          selectItem(src, shouldSelect)
          selectItem(trg, shouldSelect)
        }
      }
    }
  }
}

function handleDeselectItems () {
  return function (event) {
    const checkbox = getDeselectItemsCheckbox()
    if (checkbox) {
      event.preventDefault()
      checkbox.click()
    }
  }
}

function handleSelectionSequenceState (event) {
  if (!isInput(event) && event.key === 'Shift') {
    selectionSequence = event.type === 'keydown'
    selectionAnchor = null
    if (!selectionSequence) {
    }
  }
}

let selectionSequence = false
let selectionAnchor = null

document.addEventListener('keydown', handleSelectionSequenceState)
document.addEventListener('keyup', handleSelectionSequenceState)

// ---------------------------------------------------------------------------------------------------------------------
// folders
// ---------------------------------------------------------------------------------------------------------------------

function handleShowFolder (dir) {
  return function (event) {
    const src = $('.app-source.is-selected')
    if (src) {
      const parent = src.parentElement
      const trg = dir < 0
        ? parent.previousSibling
        : parent.nextSibling
      if (trg) {
        event.preventDefault()
        trg.click()
      }
    }
  }
}

function handleToggleFolder (dir) {
  return function (event) {
    const src = $('.app-source.is-selected')
    if (src) {
      const parent = src.parentElement
      const isExpanded = parent.classList.contains('is-expanded')
      if ((dir < 0 && isExpanded) || (dir > 0 && !isExpanded)) {
        const toggle = parent.querySelector('.v-MailboxSource-expando')
        if (toggle) {
          event.preventDefault()
          toggle.click()
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// shortcuts
// ---------------------------------------------------------------------------------------------------------------------

const handlers = {
  // mail / contact navigation
  ArrowUp: handleListShortcut('K'),
  ArrowDown: handleListShortcut('J'),
  Backspace: handleListDelete,

  // mail archive
  ModArrowUp: handleListShortcut(']'),
  ModArrowDown: handleListShortcut('['),

  // selection
  Space: handleListShortcut('X'),
  ShiftSpace: handleListShortcut('Shift+X'),
  ShiftArrowUp: handleSelectItem(-1),
  ShiftArrowDown: handleSelectItem(1),
  Escape: handleDeselectItems(),

  // folders
  AltArrowUp: handleShowFolder(-1),
  AltArrowDown: handleShowFolder(1),
  AltArrowLeft: handleToggleFolder(-1),
  AltArrowRight: handleToggleFolder(1),
}

document.addEventListener('keydown', function (event) {
  if (!isInput(event)) {
    const combo = getCombo(event)
    const handler = handlers[combo]
    if (handler) {
      handler(event)
    }
  }
})

// ---------------------------------------------------------------------------------------------------------------------
// editor
// ---------------------------------------------------------------------------------------------------------------------

document.addEventListener('keydown', function (event) {
  const { key, target } = event
  const editor = target.__squire__
  if (key === 'Tab') {
    if (editor) {
      // setup
      event.preventDefault()
      const indent = !event.shiftKey
      const path = editor.getPath()

      // lists
      if (/\bLI\b/.test(path)) {
        indent
          ? editor.increaseListLevel()
          : editor.decreaseListLevel()
      }

      // blockquotes
      else {
        const toolbar = target.closest('.v-RichText').querySelector('.v-Toolbar')
        const text = indent ? 'Quote' : 'Unquote'
        const button = $t(toolbar, text)
        if (button) {
          button.click()
        }
      }
    }
  }
})

// ---------------------------------------------------------------------------------------------------------------------
// accounts
// ---------------------------------------------------------------------------------------------------------------------

function saveUsers () {
  Storage.set('users', users)
}

function loadUsers () {
  const users = Storage.get('users')
  if (users) {
    users.forEach(user => {
      addUser(user.id, user.email)
    })
  }
}

function addUser (id, email) {
  // variables
  const url = `https://www.fastmail.com/mail/Inbox/?u=${id}`
  if ($menu.querySelector(`a[href="${url}"]`)) {
    return
  }

  // add user
  const $user = $switch.cloneNode(true)
  $user.querySelector('a').setAttribute('href', url)
  $user.innerHTML = $user.innerHTML.replace('Switch user', email)
  $menu.insertBefore($user, $switch.nextSibling)

  // save user
  users.push({ id, email })
  saveUsers()

  // remove user
  $user.addEventListener('click', event => {
    event.preventDefault()
    if (isModifier(event)) {
      const index = users.findIndex(user => user.email === email)
      if (index > -1) {
        $menu.removeChild($user)
        users.splice(index, 1)
        saveUsers()
      }
    }
  })
}

function handleAddUser (event) {
  if (isModifier(event)) {
    event.preventDefault()
    event.stopImmediatePropagation()

    // data
    const email = $('.v-MainNavToolbar-userName').innerText
    const id = new URLSearchParams(location.search).get('u')
    addUser(id, email)

    // save

  }
}

function setupUsers (node) {
  // global
  $menu = node

  // move help to end
  $menu.appendChild($menu.querySelector('li:nth-child(1)'))

  // setup add users
  $switch = $menu.querySelector('li:nth-child(1)')
  $switch.addEventListener('click', handleAddUser)

  // load existing users
  loadUsers()
}

let $menu, $switch
let users = []

const observer = new MutationObserver(function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.addedNodes) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1 && node.matches('.v-PopOverContainer')) {
          const menu = node.querySelector('ul.v-MainMenu-admin')
          if (menu) {
            observer.disconnect()
            setupUsers(menu)
          }
        }
      }
    }
  }
})

observer.observe(document.body, { childList: true })

// ---------------------------------------------------------------------------------------------------------------------
// styles
// ---------------------------------------------------------------------------------------------------------------------

document.body.classList.add('better-fastmail')

// ---------------------------------------------------------------------------------------------------------------------
// done
// ---------------------------------------------------------------------------------------------------------------------

console.log('Better FastMail running...')
