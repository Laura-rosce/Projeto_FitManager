import { autenticarAdministrador } from '../controllers/admin.controller.js';

const adminRouter = (app) => {
    app.post('/admin', autenticarAdministrador);
}

export default adminRouter;