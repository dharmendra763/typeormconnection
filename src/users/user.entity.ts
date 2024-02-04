import {
    AfterInsert,  
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    AfterRemove,
    AfterUpdate
} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log("Inserted", this.id);
    }

    @AfterRemove()
    afterRemove() {
        console.log("removed", this.id);
    }

    @AfterUpdate()
    afterUpdate() {
        console.log("updated", this.id);
    }
}