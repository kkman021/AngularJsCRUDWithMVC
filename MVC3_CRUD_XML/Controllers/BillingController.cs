using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Web;
using System.Web.Mvc;
using CRUD_XML_MVC.Models;
using Newtonsoft.Json;
using System.Collections.ObjectModel;
using System.Linq.Expressions;

namespace CRUD_XML_MVC.Controllers
{
    class ErrorModel
    {
        /// <summary>
        /// Form 裡的input的Name
        /// </summary>
        public string key { get; set; }
        /// <summary>
        /// 該input的錯誤訊息
        /// </summary>
        public string value { get; set; }
    }

    public class BillingController : Controller
    {
        private IBillingRepository _repository;
        private SelectList typeList = new SelectList(new[] { "Meeting", "Requirements", "Development", "Testing", "Documentation" });

        public BillingController()
            : this(new BillingRepository())
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
        public string ListBillings(int Currentpage = 1, int itemsPerPage = 1, string sortBy = "Hours", bool reverse = false, string searchName = null)
        {
            var Bills = _repository.GetBillings();

            if (!string.IsNullOrWhiteSpace(searchName))
            {
                searchName = searchName.ToLower();
                Bills = Bills.Where(x =>
                    x.Customer.ToLower().Contains(searchName));
            }

            Bills = Bills.AsQueryable().OrderBy(sortBy + (reverse ? " descending" : ""));
            var ToTalCount = Bills.Count();
            // paging
            Bills = Bills.Skip((Currentpage - 1) * itemsPerPage).Take(itemsPerPage);

            var json = new
            {
                count = ToTalCount,
                data = Bills
            };
            return JsonConvert.SerializeObject(json);
        }

        [HttpGet]
        public string ListJobType()
        {
            return "[{\"name\": \"醫生\",\"id\": 1},{\"name\": \"老師\",\"id\": 2},{\"name\": \"工程師\",\"id\": 3},{\"name\": \"藥師\",\"id\": 4},{\"name\": \"設計師\",\"id\": 5}]";
        }

        [HttpPost]
        public string Add(Billing billing)
        {
            List<ErrorModel> oErrorList = new List<ErrorModel>();
            //一般Model驗證
            if (!this.ModelState.IsValid)
            {
                foreach (var modelError in ModelState)
                {
                    string propertyName = modelError.Key;
                    if (modelError.Value.Errors.Count > 0)
                    {
                        //暫時只抓第一個錯誤,可改成列出所有錯誤
                        oErrorList.Add(new ErrorModel { key = propertyName, value = modelError.Value.Errors[0].ErrorMessage });
                    }
                }
            }
            //額外特殊驗證
            //為了運用強型別避免打錯字之類的錯誤，所以，Key一律用PropertyName。
            if (billing.Customer.Length < 5)
                oErrorList.Add(new ErrorModel { key = GetPropertyName<Billing>(x => x.Customer), value = "名字太短（5個字以上)" });
            if (billing.Hours < 20)
                oErrorList.Add(new ErrorModel { key = GetPropertyName<Billing>(x => x.Hours), value = "時數太短(20小時以上）" });

            if (oErrorList.Count > 0)
                return JsonConvert.SerializeObject(oErrorList);

            
            _repository.InsertBilling(billing);
            return "OK";
        }

        public static string GetPropertyName<T>(Expression<Func<T, object>> expression)
        {
            var body = expression.Body as MemberExpression;

            if (body == null)
                body = ((UnaryExpression)expression.Body).Operand as MemberExpression;

            return body.Member.Name;
        }

        [HttpPost]
        public string DeleteMode(int id)
        {
            _repository.DeleteBilling(id);
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
            catch
            {
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
                catch (Exception ex)
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
            catch (Exception ex)
            {
                //error msg for failed delete in XML file
                ViewBag.ErrorMsg = "Error deleting record. " + ex.Message;
                return View(_repository.GetBillingByID(id));
            }
        }
    }
}
