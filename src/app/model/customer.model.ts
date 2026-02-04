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
    userId?: number;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
}

interface OrderItem {
    trainingId: number;
    trainingName: string;
    quantity: number;
    price: number;

}