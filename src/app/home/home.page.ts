import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  habitaciones: any[] = [];

  constructor(private database: DatabaseService) {}

  async ngOnInit() {
    try {
      await this.database.setupDatabase();

      await this.database.addData('101', 2, 'Habitación doble con vista al mar', 'TV, Wi-Fi, Minibar', 150.00);
      
      this.habitaciones = await this.database.fetchData();
      
      console.log(this.habitaciones);
    } catch (error) {
      console.error('Error during database operations in HomePage:', error);
    }
  }
}
