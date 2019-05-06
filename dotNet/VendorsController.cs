using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Models;
using Models.Domain;
using Models.Requests;
using Services;
using Web.Controllers;
using Web.Core.Filters;
using Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Web.Api.Controllers
{
    [Route("api/vendors")]
    public class VendorsController : BaseApiController
    {
        private IVendorsService _vendorsService;
        private IAuthenticationService<int> _authService;

        public VendorsController(ILogger<VendorsController> logger, IVendorsService vendorsService, IAuthenticationService<int> authService) : base(logger)
        {
            _vendorsService = vendorsService;
            _authService = authService;
        }

        [HttpPost]
        [EntityAuth(Action = EntityActionType.Write, EntityTypeId = EntityType.Businesses)]
        public ActionResult<ItemResponse<int>> Insert(VendorAddRequest model)
        {
            ActionResult result = null;
            try
            {
                int id = _vendorsService.Insert(model);
                ItemResponse<int> response = new ItemResponse<int>()
                {
                    Item = id
                };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message));
            }
            return result;
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<VendorProductsCities>>> SearchVendor(string searchTerm, int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                if (searchTerm == null || searchTerm == " ")
                {
                    searchTerm = "";
                }
                Paged<VendorProductsCities> vendorPage = _vendorsService.SearchVendors(searchTerm, pageIndex, pageSize);
                if (vendorPage.PagedItems == null)
                {
                    result = NotFound404(new ErrorResponse("No Data Found"));
                }
                else
                {
                    ItemResponse<Paged<VendorProductsCities>> response = new ItemResponse<Paged<VendorProductsCities>>();
                    response.Item = vendorPage;

                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message));
            }

            return result;
        }

        [HttpGet("city")]
        public ActionResult<ItemResponse<Paged<VendorProductsCities>>> SearchCity(string city, int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                Paged<VendorProductsCities> vendorPage = _vendorsService.SearchCity(city, pageIndex, pageSize);
                if (vendorPage.PagedItems == null)
                {
                    result = NotFound404(new ErrorResponse("No Data Found"));
                }
                else
                {
                    ItemResponse<Paged<VendorProductsCities>> response = new ItemResponse<Paged<VendorProductsCities>>();
                    response.Item = vendorPage;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message));
            }
            return result;
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<VendorProductsCities>>> GetPaginated(int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                Paged<VendorProductsCities> vendorPage = _vendorsService.GetPaginated(pageIndex, pageSize);
                if (vendorPage.PagedItems == null)
                {
                    result = NotFound404(new ErrorResponse("No Data Found"));
                }
                else
                {
                    ItemResponse<Paged<VendorProductsCities>> response = new ItemResponse<Paged<VendorProductsCities>>();
                    response.Item = vendorPage;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message));
            }
            return result;
        }

        [HttpGet("event")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<List<VendorImgUrl>>> GetEventId(int eventId)
        {
            ActionResult result = null;
            try
            {
                List<VendorImgUrl> vendorList = _vendorsService.GetEventId(eventId);
                if (vendorList == null)
                {
                    result = NotFound404(new ErrorResponse("No Record(s) Found"));
                }
                else
                {
                    ItemResponse<List<VendorImgUrl>> response = new ItemResponse<List<VendorImgUrl>>();
                    response.Item = vendorList;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message));
            }
            return result;
        }

        [HttpGet("geo")]
        public ActionResult<ItemResponse<Paged<VendorProductsCities>>> SearchGeo(double lat, double lng, double radius, int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                Paged<VendorProductsCities> vendorPage = _vendorsService.SearchGeo(lat, lng, radius, pageIndex, pageSize);
                if (vendorPage.PagedItems == null)
                {
                    result = NotFound404(new ErrorResponse("No Data Found"));
                }
                else
                {
                    ItemResponse<Paged<VendorProductsCities>> response = new ItemResponse<Paged<VendorProductsCities>>();
                    response.Item = vendorPage;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message));
            }
            return result;
        }

        [HttpGet("searchduo")]
        public ActionResult<ItemResponse<Paged<VendorProductsCities>>> DuoSearch(double lat, double lng, double radius, string searchTerm, int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                if (searchTerm == null || searchTerm == " ")
                {
                    searchTerm = "";
                }
                Paged<VendorProductsCities> vendorPage = _vendorsService.DuoSearch(lat, lng, radius, searchTerm, pageIndex, pageSize);
                if (vendorPage.PagedItems == null)
                {
                    result = NotFound404(new ErrorResponse("No Data Found"));
                }
                else
                {
                    ItemResponse<Paged<VendorProductsCities>> response = new ItemResponse<Paged<VendorProductsCities>>();
                    response.Item = vendorPage;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message));
            }
            return result;
        }

        [HttpPost("locations")]
        public ActionResult<SuccessResponse> Insert(VendorsAndLocationsAddRequest model)
        {
            ActionResult result = null;
            try
            {
                int currentUserId = _authService.GetCurrentUserId();
                _vendorsService.Insert(model, currentUserId);
                SuccessResponse response = new SuccessResponse();
                result = Ok200(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message));
            }
            return result;
        }

        //EntityAuth - Not need. Only brings back Records for currently Signed In User
        [HttpGet("{pageIndex:int}/{pageSize:int}")]
        public ActionResult<ItemResponse<Paged<VendorWithContact>>> GetByUser(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                int currentUserId = _authService.GetCurrentUserId();
                Paged<VendorWithContact> vendors = _vendorsService.GetByUserId(pageIndex, pageSize, currentUserId);
                ItemResponse<Paged<VendorWithContact>> response = new ItemResponse<Paged<VendorWithContact>>();
                response.Item = vendors;
                result = Ok200(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message));
            }
            return result;
        }

        [HttpGet("paged")]
        public ActionResult<ItemResponse<Paged<VendorImgUrl>>> GetEventIdPaginated(int eventId, int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<VendorImgUrl> vendorList = _vendorsService.GetEventIdPaginated(eventId, pageIndex, pageSize);
                if (vendorList.PagedItems == null)
                {
                    result = NotFound404(new ErrorResponse("No Records Found"));
                }
                else
                {
                    ItemResponse<Paged<VendorImgUrl>> response = new ItemResponse<Paged<VendorImgUrl>>();
                    response.Item = vendorList;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message));
            }
            return result;
        }

        [HttpDelete("{id:int}/{locationId:int}")]
        [EntityAuth(Action = EntityActionType.Write, EntityTypeId = EntityType.Vendors)]
        public ActionResult<SuccessResponse> Delete(int id, int locationId)
        {
            ActionResult result = null;
            try
            {
                _vendorsService.Delete(id, locationId);
                SuccessResponse response = new SuccessResponse();
                return Ok200(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message));
            }
            return result;
        }
    }
}