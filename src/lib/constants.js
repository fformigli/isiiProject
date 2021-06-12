PERMISSION_OPERATIONS = [
    { value: `ANY`, label: `Cualquiera` },
    { value: `CREATE`, label: `Crear` },
    { value: `DELETE`, label: `Eliminar` },
    { value: `READ`, label: `Ver` },
    { value: `UPDATE`, label: `Actualizar` },
]

TASK_STATUS_VALUES = [
    { value: `iniciado`, label: `Iniciado` },
    { value: `pendiente`, label: `Pendiente` },
    { value: `finalizado`, label: `Finalizado` }
]

TASK_PRIORITY_VALUES = [
    { value: 1, label: 'Urgente' },
    { value: 2, label: 'Alta' },
    { value: 3, label: 'Media' },
    { value: 4, label: 'Baja' },
]

module.exports = { PERMISSION_OPERATIONS, TASK_STATUS_VALUES, TASK_PRIORITY_VALUES }