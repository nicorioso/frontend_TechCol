import crudService from "../generic/crud_services";

class CustomerService extends crudService {
  constructor() {
    super('customers');
  }

  async register(customerData) {
    return this.api.post('/customers/register', customerData);
  }
}

export default new CustomerService();