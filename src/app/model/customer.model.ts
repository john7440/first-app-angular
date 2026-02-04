import { Training } from "./training/training";

export interface Customer{
    id: number;
    name: string;
    firstName: string;
    address: string;
    phone: string;
    email: string;
    createdAt?: string;
}

export interface Order{
    id: number;
    customerId :number;
    userId: number;
    items: OrderItem[];
    totalAmount: number;
    status: 'En attente' | 'confirmé' | 'Annulé';
    createdAt: string;
}

export interface OrderItem {
    training: Training;
    quantity: number;

}