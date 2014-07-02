using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRUD_XML_MVC.Models;

namespace CRUD_XML_MVC.Controllers
{
    public class BillingController : Controller
    {
        private IBillingRepository _repository;
        private SelectList typeList = new SelectList(new[]{"Meeting","Requirements","Development","Testing","Documentation"});

        public BillingController(): this(new BillingRepository())
        {
        }

        public BillingController(IBillingRepository repository)
        {
            _repository = repository;
        }


        public ActionResult Index()
        {
            return View(_repository.GetBillings());
        }

        [HttpGet]
        public JsonResult ListBillings()
        {
            return Json(_repository.GetBillings(),JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetDetails(int id)
        {
            return Json(_repository.GetBillingByID(id), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public string ListJobType()
        {
            return "[{\"name\": \"醫生\",\"id\": 1},{\"name\": \"老師\",\"id\": 2},{\"name\": \"工程師\",\"id\": 3},{\"name\": \"藥師\",\"id\": 4},{\"name\": \"設計師\",\"id\": 5}]";
        }

        [HttpPost]
        public string Add(Billing billing)
        {
            _repository.InsertBilling(billing);
            return "OK";
        }

        [HttpPost]
        public string EditMode(Billing billing)
        {
            try
            {
                _repository.EditBilling(billing);
                return "OK";
            }
            catch {
                return "Fail";
            }
        }

        public ActionResult Details(int id)
        {            
            Billing billing = _repository.GetBillingByID(id);
            if (billing == null)
                return RedirectToAction("Index");

            return View(billing);
        }


        public ActionResult Create()
        {
            ViewBag.TypeList = typeList;
            return View();
        }

       


        [HttpPost]
        public ActionResult Create(Billing billing)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _repository.InsertBilling(billing);
                    return RedirectToAction("Index");
                }
                catch(Exception ex)
                {
                    //error msg for failed insert in XML file
                    ModelState.AddModelError("", "Error creating record. " + ex.Message);
                }
            }

            return View(billing);
        }

 
        public ActionResult Edit(int id)
        {
            Billing billing = _repository.GetBillingByID(id);
            if (billing == null)
                return RedirectToAction("Index");

            ViewBag.TypeList = typeList;
            return View(billing);
        }


        [HttpPost]
        public ActionResult Edit(Billing billing)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _repository.EditBilling(billing);
                    return RedirectToAction("Index");
                }
                catch (Exception ex)
                {
                    //error msg for failed edit in XML file
                    ModelState.AddModelError("", "Error editing record. " + ex.Message);
                }
            }

            return View(billing);
        }

 
        public ActionResult Delete(int id)
        {
            Billing billing = _repository.GetBillingByID(id);
            if (billing == null)
                return RedirectToAction("Index");
            return View(billing);
        }


        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                _repository.DeleteBilling(id);
                return RedirectToAction("Index");
            }
            catch(Exception ex)
            {
                //error msg for failed delete in XML file
                ViewBag.ErrorMsg = "Error deleting record. " + ex.Message;
                return View(_repository.GetBillingByID(id));
            }
        }
    }
}
