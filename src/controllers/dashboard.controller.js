const controller = {}

controller.view = async (req, res) => {
    const dataForm = {
        user: req.user
    }
    res.render('dashboard/dashboard', dataForm);
};

module.exports = controller;