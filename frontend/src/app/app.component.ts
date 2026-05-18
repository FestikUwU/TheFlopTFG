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

    const root = this.animationCtrl.create();

    if (opts.enteringEl) {
      const enterAnim = this.animationCtrl
        .create()
        .addElement(opts.enteringEl)
        .duration(250)
        .easing('ease-out')
        .fromTo('opacity', 0, 1);

      root.addAnimation(enterAnim);
    }

    if (opts.leavingEl) {
      const leaveAnim = this.animationCtrl
        .create()
        .addElement(opts.leavingEl)
        .duration(200)
        .easing('ease-in')
        .fromTo('opacity', 1, 0);

      root.addAnimation(leaveAnim);
    }

    return root;
  };
}
