using Data;
using Data.Providers;
using Models;
using Models.Domain;
using Models.Requests;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace Services
{
    public class EventsService : IEventsService
    {
        private IDataProvider _dataProvider;

        public EventsService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        private static EventLocation Mapper(IDataReader reader, ref int index)
        {
            EventLocation model = new EventLocation();

            model.Id = reader.GetSafeInt32(index++);
            model.EventTypeId = reader.GetSafeInt32(index++);
            model.Name = reader.GetSafeString(index++);
            model.Summary = reader.GetSafeString(index++);
            model.Headline = reader.GetSafeString(index++);
            model.Description = reader.GetSafeString(index++);
            model.VenueId = reader.GetSafeInt32(index++);
            model.EventStatusId = reader.GetSafeInt32(index++);
            model.License = reader.GetSafeString(index++);
            model.IsFree = reader.GetSafeBool(index++);
            model.DateCreated = reader.GetSafeDateTime(index++);
            model.DateModified = reader.GetSafeDateTime(index++);
            model.SetupTime = reader.GetSafeDateTime(index++);
            model.DateStart = reader.GetSafeDateTime(index++);
            model.DateEnd = reader.GetSafeDateTime(index++);
            model.PromoterId = reader.GetSafeInt32(index++);
            model.VenueName = reader.GetSafeString(index++);
            model.LineOne = reader.GetSafeString(index++);
            model.LineTwo = reader.GetSafeString(index++);
            model.City = reader.GetSafeString(index++);
            model.Zip = reader.GetSafeString(index++);
            model.Latitude = reader.GetSafeDouble(index++);
            model.Longitude = reader.GetSafeDouble(index++);
            model.MainImage = reader.GetSafeString(index++);

            return model;
        }

        private static Event MapEvent(IDataReader reader, ref int index)
        {
            Event model = new Event();

            model.Id = reader.GetSafeInt32(index++);
            model.EventTypeId = reader.GetSafeInt32(index++);
            model.Name = reader.GetSafeString(index++);
            model.Summary = reader.GetSafeString(index++);
            model.Headline = reader.GetSafeString(index++);
            model.Description = reader.GetSafeString(index++);
            model.VenueId = reader.GetSafeInt32(index++);
            model.EventStatusId = reader.GetSafeInt32(index++);
            model.License = reader.GetSafeString(index++);
            model.IsFree = reader.GetSafeBoolNullable(index++);
            model.DateCreated = reader.GetSafeDateTime(index++);
            model.DateModified = reader.GetSafeDateTime(index++);
            model.SetupTime = reader.GetSafeDateTime(index++);
            model.DateStart = reader.GetSafeDateTime(index++);
            model.DateEnd = reader.GetSafeDateTime(index++);
            model.PromoterId = reader.GetSafeInt32(index++);

            return model;
        }

        private static EventWithImage EventInfoMapper(IDataReader reader, ref int index)
        {
            EventWithImage model = new EventWithImage();
            {
                model.Id = reader.GetSafeInt32(index++);
                model.EventTypeId = reader.GetSafeInt32(index++);
                model.Name = reader.GetSafeString(index++);
                model.Summary = reader.GetSafeString(index++);
                model.Headline = reader.GetSafeString(index++);
                model.Description = reader.GetSafeString(index++);
                model.VenueId = reader.GetSafeInt32(index++);
                model.EventStatusId = reader.GetSafeInt32(index++);
                model.License = reader.GetSafeString(index++);
                model.IsFree = reader.GetSafeBool(index++);
                model.DateCreated = reader.GetSafeDateTime(index++);
                model.DateModified = reader.GetSafeDateTime(index++);
                model.SetupTime = reader.GetSafeDateTime(index++);
                model.DateStart = reader.GetSafeDateTime(index++);
                model.DateEnd = reader.GetSafeDateTime(index++);
                model.PromoterId = reader.GetSafeInt32(index++);
                model.ImageUrl = reader.GetSafeString(index++);
                model.VenueName = reader.GetSafeString(index++);
                model.LineOne = reader.GetSafeString(index++);
                model.LineTwo = reader.GetSafeString(index++);
                model.City = reader.GetSafeString(index++);
                model.Zip = reader.GetSafeString(index++);
                model.Latitude = reader.GetSafeDouble(index++);
                model.Longitude = reader.GetSafeDouble(index++);
            }

            return model;
        }

        public Paged<EventLocation> Select(int pageIndex, int pageSize)
        {
            List<EventLocation> eventList = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd
                (
                    "dbo.Events_SelectAllPaginatedV3",
                    inputParamMapper: delegate (SqlParameterCollection ParamCol)
                    {
                        ParamCol.AddWithValue("@PageIndex", pageIndex);
                        ParamCol.AddWithValue("@PageSize", pageSize);
                    },
                    singleRecordMapper: delegate (IDataReader reader, short set)
                    {
                        int index = 0;
                        EventLocation model = Mapper(reader, ref index);
                        if (totalCount == 0)
                        {
                            totalCount = reader.GetSafeInt32(index++);
                        }
                        if (eventList == null)
                        {
                            eventList = new List<EventLocation>();
                        }

                        eventList.Add(model);
                    }
                );
            Paged<EventLocation> result = new Paged<EventLocation>(eventList, pageIndex, pageSize, totalCount);
            return result;
        }

        public EventDetails GetDetails(int id)
        {
            EventDetails model = null;
            _dataProvider.ExecuteCmd(
                "dbo.EventDetails_SelectById",
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@EventId", id);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    model = new EventDetails();
                    int index = 0;
                    model.Event = MapEvent(reader, ref index);

                    List<Venue> venues = reader.DeserializeObject<List<Venue>>(index++);
                    if (venues != null && venues.Any())
                    {
                        model.Venue = venues.First();
                    }

                    List<Location> locations = reader.DeserializeObject<List<Location>>(index++);
                    if (locations != null && locations.Any())
                    {
                        model.Location = locations.First();
                    }
                    List<Image> primaryImages = reader.DeserializeObject<List<Image>>(index++);
                    if (primaryImages != null && primaryImages.Any())
                    {
                        model.PrimaryImage = primaryImages.First();
                    }

                    model.Images = reader.DeserializeObject<List<Image>>(index++);
                    model.Offerings = reader.DeserializeObject<List<OfferingLookup>>(index++);
                }
                );
            return model;
        }

        public PromoterProfileFacing Get(int promoterId, int pageIndex, int pageSize)
        {
            List<EventLocation> eventList = null;
            PromoterProfileFacing promoter = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd
                (
                "dbo.PromoterEventLocationSet_SelectByPromoterIdV3",
                inputParamMapper: delegate (SqlParameterCollection ParamCol)
                {
                    ParamCol.AddWithValue("@PromoterId", promoterId);
                    ParamCol.AddWithValue("@PageIndex", pageIndex);
                    ParamCol.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (promoter == null)
                    {
                        promoter = new PromoterProfileFacing();
                    }
                    switch (set)
                    {
                        case 0:
                            {
                                if (eventList == null)
                                {
                                    int pIndex = 0;
                                    promoter.Id = reader.GetSafeInt32(pIndex++);
                                    promoter.ShortDescription = reader.GetSafeString(pIndex++);
                                    promoter.Name = reader.GetSafeString(pIndex++);
                                    promoter.BusinessUrl = reader.GetSafeString(pIndex++);
                                    promoter.ImageUrl = reader.GetSafeString(pIndex++);
                                }
                                break;
                            }
                        case 1:
                            {
                                int index = 0;
                                EventLocation model = Mapper(reader, ref index);
                                if (totalCount == 0)
                                {
                                    totalCount = reader.GetSafeInt32(index++);
                                }
                                if (eventList == null)
                                {
                                    eventList = new List<EventLocation>();
                                }
                                if (model != null)
                                {
                                    eventList.Add(model);
                                }
                                break;
                            }
                    }
                }
                );
            if (eventList != null)
            {
                promoter.Events = new Paged<EventLocation>(eventList, pageIndex, pageSize, totalCount);
            }
            return promoter;
        }

        public Paged<EventWithImage> GetByVendor(int vendorId, int pageIndex, int pageSize)
        {
            Paged<EventWithImage> results = null;
            List<EventWithImage> eventList = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(
                "dbo.Events_SelectByVendorId",
                inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@VendorId", vendorId);
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    EventWithImage model = EventInfoMapper(reader, ref index);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    if (eventList == null)
                    {
                        eventList = new List<EventWithImage>();
                    }
                    eventList.Add(model);
                });
            if (eventList != null)
            {
                results = new Paged<EventWithImage>(eventList, pageIndex, pageSize, totalCount);
            }
            return results;
        }

        public Paged<EventWithImage> GetByUser(int pageIndex, int pageSize, int currentUserId)
        {
            Paged<EventWithImage> results = null;
            List<EventWithImage> eventList = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(
                "dbo.Events_SelectByVendors",
                inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@UserId", currentUserId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    EventWithImage model = new EventWithImage();
                    {
                        model.Id = reader.GetSafeInt32(index++);
                        model.EventTypeId = reader.GetSafeInt32(index++);
                        model.Name = reader.GetSafeString(index++);
                        model.Summary = reader.GetSafeString(index++);
                        model.Headline = reader.GetSafeString(index++);
                        model.Description = reader.GetSafeString(index++);
                        model.VenueId = reader.GetSafeInt32(index++);
                        model.EventStatusId = reader.GetSafeInt32(index++);
                        model.License = reader.GetSafeString(index++);
                        model.IsFree = reader.GetSafeBool(index++);
                        model.DateCreated = reader.GetSafeDateTime(index++);
                        model.DateModified = reader.GetSafeDateTime(index++);
                        model.SetupTime = reader.GetSafeDateTime(index++);
                        model.DateStart = reader.GetSafeDateTime(index++);
                        model.DateEnd = reader.GetSafeDateTime(index++);
                        model.PromoterId = reader.GetSafeInt32(index++);
                        model.ImageUrl = reader.GetSafeString(index++);
                        model.VenueName = reader.GetSafeString(index++);
                        model.LineOne = reader.GetSafeString(index++);
                        model.LineTwo = reader.GetSafeString(index++);
                        model.City = reader.GetSafeString(index++);
                        model.Zip = reader.GetSafeString(index++);
                        model.Latitude = reader.GetSafeDouble(index++);
                        model.Longitude = reader.GetSafeDouble(index++);
                    }
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    if (eventList == null)
                    {
                        eventList = new List<EventWithImage>();
                    }
                    eventList.Add(model);
                }
                );
            if (eventList != null)
            {
                results = new Paged<EventWithImage>(eventList, pageIndex, pageSize, totalCount);
            }
            return results;
        }

        public void UpdateStatus(int id, int eventStatusId)
        {
            _dataProvider.ExecuteNonQuery
                (
                    "dbo.Events_UpdateStatus",
                    inputParamMapper: delegate (SqlParameterCollection paramCol)
                    {
                        paramCol.AddWithValue("@Id", id);
                        paramCol.AddWithValue("@EventStatusId", eventStatusId);
                    }
                );
        }

        public int CopyEvent(int id, int userId)
        {
            int returnId = 0;
            _dataProvider.ExecuteNonQuery
                (
                    "dbo.Events_InsertCopyEvent",
                    inputParamMapper: delegate (SqlParameterCollection paramCol)
                    {
                        SqlParameter p = new SqlParameter();
                        p.ParameterName = "@Id";
                        p.SqlDbType = SqlDbType.Int;
                        p.Direction = ParameterDirection.Output;
                        paramCol.Add(p);

                        paramCol.AddWithValue("@EventId", id);
                        paramCol.AddWithValue("@UserId", userId);
                    },
                    returnParameters: delegate (SqlParameterCollection paramCol)
                    {
                        Int32.TryParse(paramCol["@Id"].Value.ToString(), out returnId);
                    }
                );
            return returnId;
        }
    }
}