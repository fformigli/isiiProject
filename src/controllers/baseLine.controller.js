const pool = require('../database');

const controller = {}

controller.form = async (req, res) => {
    try {
        // const dataForm = await chargeCombos();
        const dataForm = {}

        // if(req.params.id){ // si este parametro existe, significa qeu estamos editando
        //     const query = 'select * from tasks where id = $1 order by created_by desc';
        //     const data = await pool.query(query, [req.params.id])
        //     dataForm.taskData = data.rows[0]
        // }

        return res.render('base-line/form', dataForm);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/'); // TODO: tiene que ir al list
    }
};

// controller.save = async (req, res) => {
//     try {
//         const { description, status, observation, priority, version } = req.body
//
//         if( req.params.id ) { // si este parametro existe, quiere decir que estamos actualizando
//             const query = 'update tasks set description = $1, status = $2, ' +
//                 'observation = $3, priority = $4, version = $5 where id = $6 ';
//
//             await pool.query(query, [ description, status, observation, priority, version, req.params.id])
//             req.flash('success', 'Se actualizó la Tarea');
//
//         } else { // sino estamos agregando uno nuevo
//             const query = 'insert into tasks ' +
//                 '( description, status, observation, priority, version, created_by ) ' +
//                 'values ( $1, $2, $3, $4, $5, $6 ) ';
//
//             await pool.query(query, [ description, status, observation, priority, version, req.user.id])
//             req.flash('success', 'Se agregó la Tarea');
//         }
//
//         res.redirect('/tasks');
//     } catch (err){
//         console.error(err);
//         req.flash('message', 'Error: ' + err.message);
//         return res.redirect('/tasks');
//     }
// }

module.exports = controller