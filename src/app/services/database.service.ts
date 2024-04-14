import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection, capSQLiteSet } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db!: SQLiteDBConnection;
  private sqlite: SQLiteConnection;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initDB() {
    this.db = await this.sqlite.createConnection('mydb', false, 'no-encryption', 1, false);
    await this.db.open();
  }

  
  async setupDatabase() {
    try {
      await this.initDB();
      const queries = [
        `CREATE TABLE IF NOT EXISTS cliente (id_cliente INTEGER PRIMARY KEY, nombre TEXT, apellido TEXT, correo_electronico TEXT, detalles TEXT, usuario_id_usuario INTEGER NOT NULL, FOREIGN KEY (usuario_id_usuario) REFERENCES usuario (id_usuario))`,
        `CREATE TABLE IF NOT EXISTS empleado (id_empleado INTEGER PRIMARY KEY, nombre TEXT, apellido TEXT, correo TEXT, cargo INTEGER, usuario_id_usuario INTEGER NOT NULL, FOREIGN KEY (usuario_id_usuario) REFERENCES usuario (id_usuario))`,
        `CREATE TABLE IF NOT EXISTS habitacion (id_habitacion INTEGER PRIMARY KEY, numero TEXT, categoria INTEGER, detalles TEXT, equipamiento TEXT, valor REAL)`,
        `CREATE TABLE IF NOT EXISTS imagen (id_imagen INTEGER PRIMARY KEY, url TEXT NOT NULL, habitacion_id_habitacion INTEGER NOT NULL, FOREIGN KEY (habitacion_id_habitacion) REFERENCES habitacion (id_habitacion))`,
        `CREATE TABLE IF NOT EXISTS pago (id_pago TEXT PRIMARY KEY, monto REAL, fecha_pago TEXT, reserva_id_reserva INTEGER NOT NULL, FOREIGN KEY (reserva_id_reserva) REFERENCES reserva (id_reserva))`,
        `CREATE TABLE IF NOT EXISTS reserva (id_reserva INTEGER PRIMARY KEY, fecha_inicio DATE, fecha_fin DATE, estado_pago INTEGER, codigo_qr TEXT, total_pago REAL, habitacion_id_habitacion INTEGER NOT NULL, cliente_id_cliente INTEGER NOT NULL, FOREIGN KEY (habitacion_id_habitacion) REFERENCES habitacion (id_habitacion), FOREIGN KEY (cliente_id_cliente) REFERENCES cliente (id_cliente))`,
        `CREATE TABLE IF NOT EXISTS usuario (id_usuario INTEGER PRIMARY KEY, nombre_usuario TEXT, contraseña TEXT, tipo_usuario INTEGER)`
      ]; 
      for (const query of queries) {
        await this.db.execute(query);
      }
      console.log('Database is ready!');
    } catch (error) {
      console.error('Error setting up the database:', error);
    }
}
  
async addData(numero: string, categoria: number, detalles: string, equipamiento: string, valor: number) {
  let statement = `INSERT INTO habitacion (numero, categoria, detalles, equipamiento, valor) VALUES (?, ?, ?, ?, ?)`;
  let values = [numero, categoria, detalles, equipamiento, valor];
  return await this.db.run(statement, values);
}


async fetchData(): Promise<any[]> {
  try {
    const result = await this.db.query(`SELECT * FROM habitacion`);
    return result.values || []; 
  } catch (error) {
    console.error('Failed to fetch data', error);
    return [];  
  }
}



}
