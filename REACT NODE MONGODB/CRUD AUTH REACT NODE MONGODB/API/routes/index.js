import pkg from 'express';
const { Router } = pkg;
import { AjouteUser, AfficheUser, AfficheUneUser, ModifierUser, DeleteUser, ChercheUser } from '../controller.js/UserController.js';
import { InscriptionAdmin, LoginAdmin } from '../controller.js/AuthController.js';
import { RefreshToken } from '../controller.js/RefreshToken.js';
import { verifyToken } from "../middleware/VerifyToken.js";
const router = Router();

router.post('/ajouteUser', verifyToken, AjouteUser);
router.get('/afficheUser', verifyToken, AfficheUser);
router.get('/afficheUneUser/:id', verifyToken, AfficheUneUser);
router.put('/modifierUser/:id', verifyToken, ModifierUser);
router.delete('/suprimerUser/:id', verifyToken, DeleteUser);
router.get('/chercheUser/:value',verifyToken, ChercheUser);

router.post('/inscriptionAdmin', InscriptionAdmin);
router.post('/loginAdmin', LoginAdmin);

router.get('/token', RefreshToken);

export default router;