import pkg from 'express';
const { Router } = pkg;
import { Inscription, Login, RefreshToken } from "../controllers/AuthController.js";
import { AjouteEmploye, AfficheEmploye, SuprimerEmployer, AfficheUneEmploye, ModifierEmploye } from "../controllers/EmployeController.js";
import { verifyToken } from "../middlewares/VerifyToken.js";

const router = Router();

router.post('/inscription', Inscription);
router.post('/login', Login);
router.post('/ajouteEmploye', verifyToken, AjouteEmploye);
router.get('/afficheEmploye', verifyToken, AfficheEmploye);
router.get('/afficheUneEmploye/:id', verifyToken, AfficheUneEmploye);
router.delete('/suprimerEmploye/:id', verifyToken, SuprimerEmployer);
router.put('/modifierEmploye/:id', verifyToken, ModifierEmploye);
router.get('/token', RefreshToken);

export default router;