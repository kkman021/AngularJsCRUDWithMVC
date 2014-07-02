using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace CRUD_XML_MVC.Models
{
    public class Billing
    {
        public Billing()
        {
            this.ID = 0;
            this.Customer = null;
            this.JobType = null;
            this.Date = DateTime.Now;
            this.Description = null;
            this.Hours = 0;
        }

        public Billing(int id, string customer, string JobType, DateTime date, string description, int hours)
        {
            this.ID = id;
            this.Customer = customer;
            this.JobType = JobType;
            this.Date = date;
            this.Description = description;
            this.Hours = hours;
        }

        public int ID { get; set; }
        [Required(ErrorMessage = "Customer is required")]
        public string Customer { get; set; }
        [Required(ErrorMessage = "Type is required")]
        public string JobType { get; set; }
        [Required(ErrorMessage = "Date is required")]
        public DateTime Date { get; set; }
        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Hours is required")]
        public int Hours { get; set; }
    }
}