using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace CRUD_XML_MVC.Models
{
    public class BillingRepository: IBillingRepository
    {
        private List<Billing> allBillings;
        private XDocument billingData;

        // constructor
        public BillingRepository()
        {
            allBillings = new List<Billing>();

            billingData = XDocument.Load(HttpContext.Current.Server.MapPath("~/App_Data/Billings.xml"));
            var billings = from billing in billingData.Descendants("item")
                            select new Billing((int)billing.Element("id"), billing.Element("customer").Value,
                            billing.Element("JobType").Value, (DateTime)billing.Element("date"),
                            billing.Element("description").Value, (int)billing.Element("hours"));
            allBillings.AddRange(billings.ToList<Billing>());
        }

        // returna list of all billings
        public IEnumerable<Billing> GetBillings()
        {
            return allBillings;
        }

        public Billing GetBillingByID(int id)
        {
            return allBillings.Find(item => item.ID == id);
        }

        // Insert Record
        public void InsertBilling(Billing billing)
        {
            billing.ID = (int)(from b in billingData.Descendants("item") orderby (int)b.Element("id") descending select (int)b.Element("id")).FirstOrDefault() + 1;

            billingData.Root.Add(new XElement("item", new XElement("id", billing.ID), new XElement("customer", billing.Customer),
                new XElement("JobType", billing.JobType), new XElement("date", billing.Date.ToShortDateString()), new XElement("description", billing.Description), 
                new XElement("hours", billing.Hours)));

            billingData.Save(HttpContext.Current.Server.MapPath("~/App_Data/Billings.xml"));
        }

        // Delete Record
        public void DeleteBilling(int id)
        {
            billingData.Root.Elements("item").Where(i => (int)i.Element("id") == id).Remove();

            billingData.Save(HttpContext.Current.Server.MapPath("~/App_Data/Billings.xml"));
        }

        // Edit Record
        public void EditBilling(Billing billing)
        {
            XElement node = billingData.Root.Elements("item").Where(i => (int)i.Element("id") == billing.ID).FirstOrDefault();

            node.SetElementValue("customer", billing.Customer);
            node.SetElementValue("JobType", billing.JobType);
            node.SetElementValue("date", billing.Date.ToShortDateString());
            node.SetElementValue("description", billing.Description);
            node.SetElementValue("hours", billing.Hours);

            billingData.Save(HttpContext.Current.Server.MapPath("~/App_Data/Billings.xml"));
        }

    }
}