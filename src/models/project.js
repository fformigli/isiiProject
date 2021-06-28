const pool = require('../database');

const controller = {}

const chargeCombos = async () => {
    const values = [`iniciado`, `pendiente`, `finalizado`]
    const statusValues = []
    values.forEach((value) => {
        statusValues.push({ value })
    })

    return { statusValues };
}

controller.list = async (req, res) => {
    try {
        let query;
        let projects;

        console.log(res.locals)

        if(res.locals.userPermissions.some( i => i.contextid === 0)) {
            query = 'select * from projects order by created_at desc'
            projects = await pool.query(query);
        } else {
            query = 'select *' +
                ' from projects p' +
                ' join project_participants pp on p.id = pp.projectid' +
                ' where pp.userid = $1' +
                ' order by p.created_at desc';

            projects = await pool.query(query, [req.user.id])
        }

        return res.render('projects/projects.hbs', {projects: projects.rows})

    } catch (e) {
        console.error(e);
        req.flash('message', 'Error: ' + e.message);
        return res.redirect('/');
    }
}

controller.form = async (req, res) => {
    try {
        const dataForm = await chargeCombos();

        if(req.params.id){ // si este parametro existe, significa qeu estamos editando
            let query = 'select * from projects where id = $1 order by created_by desc';
            let data = await pool.query(query, [req.params.id])
            dataForm.projectData = data.rows[0]

            // vemos si tiene tareas asignadas
            query = 'select * from tasks where project_id = $1 order by created_at desc'
            data = await pool.query(query, [req.params.id])
            dataForm.tasks = data.rows

            // vemos si tiene lineas base definidas
            query = 'select *, ( select count(*) from base_line_tasks where base_line_id = bl.id ) as tasks ' +
                ' from base_lines bl' +
                ' where project_id = $1 order by created_at desc'
            data = await pool.query(query, [req.params.id])
            dataForm.baseLines = data.rows

            // participantes
            query = 'select u.fullname, r.name' +
                ' from project_participants pp' +
                ' join users u on u.id = pp.userid' +
                ' join user_roles ur on ur.userid = u.id and contextid = pp.projectid' +
                ' join roles r on r.id = ur.rolid' +
                ' where projectid = $1 order by r.name desc'
            data = await pool.query(query, [req.params.id])
            dataForm.participants = data.rows
        }


        return res.render('projects/form', dataForm);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/projects');
    }
};
 
controller.save = async (req, res) => {
    try {
        const { name } = req.body

        if( req.params.id ) { // si este parametro existe, quiere decir que estamos actualizando
            const query = 'update projects set name = $1 where id = $2 ';

            await pool.query(query, [ name, req.params.id ])
            req.flash('success', 'Se actualizó el proyecto');

        } else { // sino estamos agregando uno nuevo
            const query = 'insert into projects ' +
            '( name, created_by ) ' +
            'values ( $1, $2 ) ';

            await pool.query(query, [ name, req.params.id ])
            req.flash('success', 'Se agregó el proyecto');
        }

        res.redirect('/projects');
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/projects');
    }
}

// participants
controller.participants = async (req, res) => {
    try {
        const { id } = req.params

        const dataForm = {}
        let sql = 'select u.id as userid, fullname, username,' +
            ' ur.rolid, r.name' +
            ' from users u' +
            ' join project_participants pp on u.id = pp.userid' +
            ' join user_roles ur on ur.contextid = pp.projectid and ur.userid = u.id' +
            ' join roles r on r.id = ur.rolid' +
            ' where pp.projectid = $1'

        dataForm.participants = await pool.query(sql, [id])
        dataForm.participants = dataForm.participants.rows

        sql = 'select u.id as userid, fullname, username' +
            ' from users u' +
            ' left join project_participants pp on u.id = pp.userid and pp.projectid = $1' +
            ' where pp.userid is null' // solo es para los no participantes

        dataForm.nonParticipants = await pool.query(sql, [id])
        dataForm.nonParticipants = dataForm.nonParticipants.rows

        dataForm.project = id

        const roles = await pool.query("select id, name from roles where context = 'proyecto' order by name")
        dataForm.rolesCombo = roles.rows

        res.render('projects/participants', dataForm)
    } catch (e) {
        req.flash('message', 'Error: ' + e.message);
        return res.redirect('/projects');
    }
}

controller.addParticipant = async (req, res) => {
    const { userid, projectid, rolid } = req.params
    try {

        // insertar project participants
        const sql = 'insert into project_participants (projectid, userid, crated_by) ' +
            'values ($1, $2, $3)'

        await pool.query(sql, [projectid, userid, req.user.id])

        // guardar el rol que tiene ahi
        const sqlrol = 'insert into user_roles values ($1, $2, $3)'
        await pool.query(sqlrol, [userid, rolid, projectid])

        req.flash('success', 'Se agrego el participante')
        res.redirect(`/projects/participants/${projectid}`)

    } catch (e) {

        req.flash('message', 'Error: ' + e.message);
        return res.redirect(`/projects/participants/${projectid}`);
    }
}

controller.removeParticipant = async (req, res) => {
    const { projectid, userid } = req.params
    try {
        await pool.query('delete from user_roles' +
            ' where contextid = $1 and userid = $2', [projectid, userid])
        await pool.query('delete from project_participants' +
            ' where projectid = $1 and userid = $2', [projectid, userid])

        req.flash('success', 'Se quitó el participante')
        res.redirect(`/projects/participants/${projectid}`)
    } catch (e) {
        req.flash('message', 'Error: ' + e.message);
        return res.redirect(`/projects/participants/${projectid}`);
    }

}

module.exports = controller

