'use client';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  vendor_id: string;
  vendor_name: string;
}

export class SimpleCart {
  private static instance: SimpleCart;
  private items: CartItem[] = [];
  private listeners: (() => void)[] = [];

  static getInstance(): SimpleCart {
    if (!SimpleCart.instance) {
      SimpleCart.instance = new SimpleCart();
    }
    return SimpleCart.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('vendorsync_cart');
    if (saved) {
      this.items = JSON.parse(saved);
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vendorsync_cart', JSON.stringify(this.items));
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  addItem(item: Omit<CartItem, 'quantity'>) {
    const existing = this.items.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ ...item, quantity: 1 });
    }
    this.saveToStorage();
    this.notifyListeners();
  }

  removeItem(id: string) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveToStorage();
    this.notifyListeners();
  }

  updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.quantity = quantity;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  clearCart() {
    this.items = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}