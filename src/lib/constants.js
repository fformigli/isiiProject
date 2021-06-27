const PERMISSION_OPERATIONS = [
    { value: `ANY`, label: `Cualquiera` },
    { value: `CREATE`, label: `Crear` },
    { value: `DELETE`, label: `Eliminar` },
    { value: `READ`, label: `Ver` },
    { value: `UPDATE`, label: `Actualizar` },
]

const TASK_STATUS_VALUES = [
    { value: `iniciado`, label: `Iniciado` },
    { value: `pendiente`, label: `Pendiente` },
    { value: `finalizado`, label: `Finalizado` }
]

const TASK_PRIORITY_VALUES = [
    { value: 1, label: 'Urgente' },
    { value: 2, label: 'Alta' },
    { value: 3, label: 'Media' },
    { value: 4, label: 'Baja' },
]

const ROLE_CONTEXT = [
    { value: "sistema", label: 'Sistema'},
    { value: "proyecto", label: 'Proyecto'}
]

const LB_STATUS = [
    { value: "abierto", label: "Abierto"},
    { value: "cerrado", label: "Cerrado"}
]

module.exports = {
    PERMISSION_OPERATIONS,
    TASK_STATUS_VALUES,
    TASK_PRIORITY_VALUES,
    ROLE_CONTEXT,
    LB_STATUS
}