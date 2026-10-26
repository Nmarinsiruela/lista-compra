// Plural entries are objects keyed by Intl.PluralRules categories ('one', 'other', ...).
// Placeholders use {name} syntax and are filled from the params passed to t().

const es = {
  'app.title': 'Lista de la Compra',

  'header.title': '🛒 Lista',
  'header.statsEmpty': 'Lista vacía',
  'header.stats': { one: '{done} de {count} recogido', other: '{done} de {count} recogidos' },
  'header.emptyCart': 'Vaciar carro',
  'header.clearAll': 'Limpiar todo',
  'header.share': 'Compartir carro',

  'language.label': 'Idioma',
  'language.es': 'Español',
  'language.en': 'Inglés',

  'theme.toLight': 'Cambiar a modo claro',
  'theme.toDark': 'Cambiar a modo oscuro',

  'lists.label': 'Listas',
  'lists.defaultTitle': 'Compra',
  'lists.new': 'Nueva lista',
  'lists.rename': 'Renombrar lista',
  'lists.editHint': 'Toca para renombrar o borrar',
  'lists.namePlaceholder': 'Nombre de la lista',
  'lists.delete': 'Borrar lista',
  'lists.confirmDelete': {
    one: '¿Borrar "{title}" y su producto?',
    other: '¿Borrar "{title}" y sus {count} productos?',
  },

  'list.emptyTitle': 'Tu lista está vacía',
  'list.emptyHint': 'Empieza añadiendo productos abajo',
  'list.pending': 'Por comprar ({count})',
  'list.done': 'En el carro ({count})',

  'item.check': 'Marcar como recogido',
  'item.uncheck': 'Desmarcar',
  'item.editTags': 'Editar etiquetas',
  'item.delete': 'Eliminar',

  'addBar.placeholder': 'Añadir producto...',
  'addBar.add': 'Añadir',

  'autocomplete.removeFromHistory': 'Eliminar "{name}" del historial',

  'tags.me': 'Yo',
  'tags.family': 'Familia',
  'tags.friends': 'Amigos',
  'tags.other': 'Otros',
  'tags.external': 'Externo',

  'toast.added': '"{name}" añadido',
  'toast.alreadyInList': '"{name}" ya está en la lista',
  'toast.imported': {
    one: '{count} producto importado en "{list}"',
    other: '{count} productos importados en "{list}"',
  },
  'toast.listExists': 'Ya existe una lista "{title}"',
  'toast.listDeleted': 'Lista "{title}" borrada',
  'toast.allAlreadyInList': 'Todos los productos ya están en tu lista',
  'toast.cartAlreadyEmpty': 'El carro ya está vacío',
  'toast.returnedToList': {
    one: '{count} producto devuelto a la lista',
    other: '{count} productos devueltos a la lista',
  },
  'toast.listAlreadyEmpty': 'La lista ya está vacía',
  'toast.listCleared': { one: 'Lista borrada ({count} producto)', other: 'Lista borrada ({count} productos)' },
  'toast.nothingToShare': 'No hay productos pendientes',
  'toast.linkCopied': { one: 'Enlace copiado ({count} producto)', other: 'Enlace copiado ({count} productos)' },
}

const en = {
  'app.title': 'Shopping List',

  'header.title': '🛒 List',
  'header.statsEmpty': 'Empty list',
  'header.stats': { one: '{done} of {count} picked up', other: '{done} of {count} picked up' },
  'header.emptyCart': 'Empty cart',
  'header.clearAll': 'Clear all',
  'header.share': 'Share cart',

  'language.label': 'Language',
  'language.es': 'Spanish',
  'language.en': 'English',

  'theme.toLight': 'Switch to light mode',
  'theme.toDark': 'Switch to dark mode',

  'lists.label': 'Lists',
  'lists.defaultTitle': 'Groceries',
  'lists.new': 'New list',
  'lists.rename': 'Rename list',
  'lists.editHint': 'Tap to rename or delete',
  'lists.namePlaceholder': 'List name',
  'lists.delete': 'Delete list',
  'lists.confirmDelete': {
    one: 'Delete "{title}" and its product?',
    other: 'Delete "{title}" and its {count} products?',
  },

  'list.emptyTitle': 'Your list is empty',
  'list.emptyHint': 'Start by adding products below',
  'list.pending': 'To buy ({count})',
  'list.done': 'In the cart ({count})',

  'item.check': 'Mark as picked up',
  'item.uncheck': 'Unmark',
  'item.editTags': 'Edit tags',
  'item.delete': 'Delete',

  'addBar.placeholder': 'Add product...',
  'addBar.add': 'Add',

  'autocomplete.removeFromHistory': 'Remove "{name}" from history',

  'tags.me': 'Me',
  'tags.family': 'Family',
  'tags.friends': 'Friends',
  'tags.other': 'Other',
  'tags.external': 'External',

  'toast.added': '"{name}" added',
  'toast.alreadyInList': '"{name}" is already on the list',
  'toast.imported': {
    one: '{count} product imported into "{list}"',
    other: '{count} products imported into "{list}"',
  },
  'toast.listExists': 'A list called "{title}" already exists',
  'toast.listDeleted': 'List "{title}" deleted',
  'toast.allAlreadyInList': 'All products are already on your list',
  'toast.cartAlreadyEmpty': 'The cart is already empty',
  'toast.returnedToList': {
    one: '{count} product returned to the list',
    other: '{count} products returned to the list',
  },
  'toast.listAlreadyEmpty': 'The list is already empty',
  'toast.listCleared': { one: 'List cleared ({count} product)', other: 'List cleared ({count} products)' },
  'toast.nothingToShare': 'No pending products',
  'toast.linkCopied': { one: 'Link copied ({count} product)', other: 'Link copied ({count} products)' },
}

export const translations = { es, en }
export const LANGUAGES = Object.keys(translations)
export const DEFAULT_LANGUAGE = 'es'
