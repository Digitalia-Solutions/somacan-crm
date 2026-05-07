import { Router } from 'express';
import { TEMPLATE_REGISTRY, getTemplateDefinition } from '../config/templateRegistry.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(TEMPLATE_REGISTRY);
});

router.get('/:key', (req, res) => {
  const def = getTemplateDefinition(req.params.key);
  res.json(def);
});

export default router;
