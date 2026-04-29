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
      .duration(300)
      .easing('ease-out')
      .fromTo('opacity', 0, 1)
      .fromTo('transform', 'translateY(10px)', 'translateY(0)');

    const leaveAnim = this.animationCtrl
      .create()
      .addElement(opts.leavingEl)
      .duration(200)
      .easing('ease-in')
      .fromTo('opacity', 1, 0)
      .fromTo('transform', 'translateY(0)', 'translateY(-10px)');

    return this.animationCtrl
      .create()
      .addAnimation([enterAnim, leaveAnim]);
  };
}
