import { Component } from '@angular/core';
import {IonApp, IonRouterOutlet} from '@ionic/angular/standalone';
import { AnimationController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonRouterOutlet, IonApp]
})
export class AppComponent {

  constructor(private animationCtrl: AnimationController) {}

  fadeAnimation = (baseEl: any, opts: any) => {
    const enterAnim = this.animationCtrl
      .create()
      .addElement(opts.enteringEl)
      .duration(200)
      .fromTo('opacity', 0, 1);

    const leaveAnim = this.animationCtrl
      .create()
      .addElement(opts.leavingEl)
      .duration(200)
      .fromTo('opacity', 1, 0);

    return this.animationCtrl
      .create()
      .addAnimation([enterAnim, leaveAnim]);
  };
}
