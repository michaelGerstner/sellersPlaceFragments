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

namespace Web.Api.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventsController : BaseApiController
    {
        private IEventsService _eventsService;
        private IAuthenticationService<int> _authService;

        public EventsController(ILogger<EventsController> logger, IEventsService eventsService, IAuthenticationService<int> authService) : base(logger)
        {
            _eventsService = eventsService;
            _authService = authService;
        }

        [HttpGet("{pageIndex:int}/{pageSize:int}")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<EventLocation>>> Select(int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                Paged<EventLocation> eventList = _eventsService.Select(pageIndex, pageSize);
                if (eventList == null)
                {
                    result = NotFound404(new ErrorResponse("No Data Found"));
                }
                else
                {
                    ItemResponse<Paged<EventLocation>> response = new ItemResponse<Paged<EventLocation>>
                    {
                        Item = eventList
                    };
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
        public ActionResult<ItemResponse<PromoterProfileFacing>> Get(int promoterId, int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                PromoterProfileFacing promoter = _eventsService.Get(promoterId, pageIndex, pageSize);
                if (promoter.Id == 0)
                {
                    result = NotFound404(new ErrorResponse("No Data Found"));
                }
                else
                {
                    ItemResponse<PromoterProfileFacing> response = new ItemResponse<PromoterProfileFacing>();
                    response.Item = promoter;
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

        [HttpGet("details")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<EventDetails>> Get(int eventId)
        {
            ActionResult result = null;

            try
            {
                EventDetails eventDetails = _eventsService.GetDetails(eventId);
                if (eventDetails == null)
                {
                    result = NotFound404(new ErrorResponse("No Record Found"));
                }
                else
                {
                    ItemResponse<EventDetails> response = new ItemResponse<EventDetails>();
                    response.Item = eventDetails;
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

        [HttpGet("vendor/{vendorId:int}/{pageIndex:int}/{pageSize:int}")]
        public ActionResult<ItemResponse<EventWithImage>> GetByVendor(int vendorId, int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<EventWithImage> eventList = _eventsService.GetByVendor(vendorId, pageIndex, pageSize);
                ItemResponse<Paged<EventWithImage>> response = new ItemResponse<Paged<EventWithImage>>();
                response.Item = eventList;
                result = Ok200(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message));
            }
            return result;
        }

        [HttpGet("vendors/{pageIndex:int}/{pageSize:int}")]
        public ActionResult<ItemResponse<Paged<EventWithImage>>> GetByUser(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                int currentUserId = _authService.GetCurrentUserId();
                Paged<EventWithImage> events = _eventsService.GetByUser(pageIndex, pageSize, currentUserId);
                ItemResponse<Paged<EventWithImage>> response = new ItemResponse<Paged<EventWithImage>>();
                response.Item = events;
                result = Ok200(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message));
            }
            return result;
        }

        [HttpPut("status/{id:int}/{eventStatusId:int}")]
        [EntityAuth(Action = EntityActionType.Write, EntityTypeId = EntityType.Events)]
        public ActionResult<SuccessResponse> UpdateStatus(int id, int eventStatusId)
        {
            ActionResult result = null;
            try
            {
                _eventsService.UpdateStatus(id, eventStatusId);
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

        [HttpPost("copy/{id:int}")]
        [EntityAuth(Action = EntityActionType.Write, EntityTypeId = EntityType.Events)]
        public ActionResult<ItemResponse<int>> Copy(int id)
        {
            ActionResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int returnId = _eventsService.CopyEvent(id, userId);
                ItemResponse<int> response = new ItemResponse<int>();
                response.Item = returnId;
                result = Created201(response);
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