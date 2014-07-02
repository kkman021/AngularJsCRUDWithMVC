using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CRUD_XML_MVC.Models
{
    public interface IBillingRepository
    {
        IEnumerable<Billing> GetBillings();
        Billing GetBillingByID(int id);
        void InsertBilling(Billing billing);
        void DeleteBilling(int id);
        void EditBilling(Billing billing);
    }
}
