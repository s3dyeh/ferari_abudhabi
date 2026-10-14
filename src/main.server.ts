import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { Root } from './app/root';
import { config } from './app/app.config.server';
export default (context: BootstrapContext) => bootstrapApplication(Root, config, context);
