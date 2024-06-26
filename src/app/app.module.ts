import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { HomeComponent } from './content/home/home.component';
import { ErrorComponent } from './error/error.component';
import { ProductsComponent } from './content/products/products.component';
import { ProductDetailComponent } from './content/product-detail/product-detail.component';
import { WishlistComponent } from './content/wishlist/wishlist.component';
import { ProductsBoComponent } from './admin/products/products-bo.component';
import { UsersComponent } from './admin/users/users.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './content/user/user.component';
import { UserRegisterComponent } from './content/user-register/user-register.component';
import { AlertComponent } from './components/alert/alert.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        ErrorComponent,
        ProductsComponent,
        ProductDetailComponent,
        WishlistComponent,
        ProductsBoComponent,
        UsersComponent,
        LoginComponent,
        UserComponent,
        UserRegisterComponent,
        AlertComponent,
        ConfirmationComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        NgbModule
    ],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }
