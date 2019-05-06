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
using static Models.Domain.VendorProductsCities;

namespace Services
{
    public class VendorsService : IVendorsService
    {
        private IDataProvider _dataProvider;

        public VendorsService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        private static VendorWithContact VendorWithContactMapper(IDataReader reader, ref int index)
        {
            VendorWithContact model = new VendorWithContact();
            {
                model.Id = reader.GetSafeInt32(index++);
                model.BusinessId = reader.GetSafeInt32(index++);
                model.BusinessName = reader.GetSafeString(index++);
                model.VendorName = reader.GetSafeString(index++);
                model.VendorDescription = reader.GetSafeString(index++);
                model.Headline = reader.GetSafeString(index++);
                model.PriceMin = reader.GetSafeInt32(index++);
                model.PriceMax = reader.GetSafeInt32(index++);
                model.DateCreated = reader.GetSafeDateTime(index++);
                model.DateModified = reader.GetSafeDateTime(index++);
                model.Contact = reader.GetSafeString(index++);
                model.ImageUrl = reader.GetSafeString(index++);
            };
            return model;
        }

        public int Insert(VendorAddRequest model)
        {
            int id = 0;
            _dataProvider.ExecuteNonQuery(
                "dbo.VendorsAndOfferings_Insert",
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    SqlParameter p = new SqlParameter("@VendorOfferings", System.Data.SqlDbType.Structured);
                    if (model.VendorOfferings != null && model.VendorOfferings.Any())
                    {
                        p.Value = new Data.IntIdTable(model.VendorOfferings);
                    }
                    paramCol.Add(p);

                    SqlParameter param = new SqlParameter();
                    param.ParameterName = ("@Id");
                    param.SqlDbType = SqlDbType.Int;
                    param.Direction = ParameterDirection.Output;
                    paramCol.Add(param);

                    paramCol.AddWithValue("@BusinessId", model.BusinessId);
                    paramCol.AddWithValue("@Name", model.Name);
                    paramCol.AddWithValue("@Description", model.Description);
                    paramCol.AddWithValue("@Headline", model.Headline);
                    paramCol.AddWithValue("@PriceMin", model.PriceMin);
                    paramCol.AddWithValue("@PriceMax", model.PriceMax);
                },
                returnParameters: delegate (SqlParameterCollection paramCol)
                {
                    Int32.TryParse(paramCol["@Id"].Value.ToString(), out id);
                }
                );
            return id;
        }

        private VendorProductsCities Mapper(IDataReader reader, ref int index)
        {
            VendorProductsCities model = new VendorProductsCities();

            model.Id = reader.GetSafeInt32(index++);
            model.BusinessId = reader.GetSafeInt32(index++);
            model.VendorName = reader.GetSafeString(index++);
            model.VendorDescription = reader.GetSafeString(index++);
            model.Headline = reader.GetSafeString(index++);
            model.PriceMin = reader.GetSafeInt32(index++);
            model.PriceMax = reader.GetSafeInt32(index++);
            model.DateCreated = reader.GetSafeDateTime(index++);
            model.DateModified = reader.GetSafeDateTime(index++);
            model.Logo = reader.GetSafeString(index++);
            model.Products = reader.DeserializeObject<List<Products>>(index++);
            model.CitiesList = reader.DeserializeObject<List<Cities>>(index++);
            model.OfferingList = reader.DeserializeObject<List<Offerings>>(index++);
            model.Contact = reader.GetSafeString(index++);
            model.Email = reader.GetSafeString(index++);

            return model;
        }

        public Paged<VendorProductsCities> SearchVendors(string SearchTerms, int pageIndex, int pageSize)
        {
            List<VendorProductsCities> vendors = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(
                "dbo.VendorsProductsLocationsContact_SearchPaginated_V3",
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@SearchTerm", SearchTerms);
                    paramCol.AddWithValue("@PageIndex", pageIndex);
                    paramCol.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (vendors == null)
                    {
                        vendors = new List<VendorProductsCities>();
                    }
                    int index = 0;
                    VendorProductsCities model = Mapper(reader, ref index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    vendors.Add(model);
                }
                );

            Paged<VendorProductsCities> result = new Paged<VendorProductsCities>(vendors, pageIndex, pageSize, totalCount);

            return result;
        }

        public Paged<VendorProductsCities> GetPaginated(int pageIndex, int pageSize)
        {
            List<VendorProductsCities> vendors = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(
                "dbo.VendorsProductsLocationsContact_Paginated_V2",
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@PageIndex", pageIndex);
                    paramCol.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (vendors == null)
                    {
                        vendors = new List<VendorProductsCities>();
                    }
                    int index = 0;
                    VendorProductsCities model = Mapper(reader, ref index);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    vendors.Add(model);
                }
                );
            Paged<VendorProductsCities> result = new Paged<VendorProductsCities>(vendors, pageIndex, pageSize, totalCount);

            return result;
        }

        public Paged<VendorProductsCities> SearchCity(string city, int pageIndex, int pageSize)
        {
            List<VendorProductsCities> vendors = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(
                "dbo.VendorsProductsLocationsContact_SearchPaginatedByCity_V2",
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@SearchTerm", city);
                    paramCol.AddWithValue("@PageIndex", pageIndex);
                    paramCol.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (vendors == null)
                    {
                        vendors = new List<VendorProductsCities>();
                    }
                    int index = 0;
                    VendorProductsCities model = Mapper(reader, ref index);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    vendors.Add(model);
                }

                );
            Paged<VendorProductsCities> result = new Paged<VendorProductsCities>(vendors, pageIndex, pageSize, totalCount);
            return result;
        }

        public Paged<VendorProductsCities> SearchGeo(double lat, double lng, double radius, int pageIndex, int pageSize)
        {
            List<VendorProductsCities> vendors = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(
                "dbo.VendorsProductsLocationsContact_SearchByGeocode_V2",
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@Lat", lat);
                    paramCol.AddWithValue("@Lng", lng);
                    paramCol.AddWithValue("@Radius", radius);
                    paramCol.AddWithValue("@PageIndex", pageIndex);
                    paramCol.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (vendors == null)
                    {
                        vendors = new List<VendorProductsCities>();
                    }
                    int index = 0;
                    VendorProductsCities model = Mapper(reader, ref index);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    vendors.Add(model);
                }

                );
            Paged<VendorProductsCities> result = new Paged<VendorProductsCities>(vendors, pageIndex, pageSize, totalCount);
            return result;
        }

        public Paged<VendorProductsCities> DuoSearch(double lat, double lng, double radius, string searchTerm, int pageIndex, int pageSize)
        {
            List<VendorProductsCities> vendors = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(
                "VendorsProductsLocationsContact_SearchGeoText_V2",
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@Lat", lat);
                    paramCol.AddWithValue("@Lng", lng);
                    paramCol.AddWithValue("@Radius", radius);
                    paramCol.AddWithValue("@SearchTerm", searchTerm);
                    paramCol.AddWithValue("@PageIndex", pageIndex);
                    paramCol.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (vendors == null)
                    {
                        vendors = new List<VendorProductsCities>();
                    }
                    int index = 0;
                    VendorProductsCities model = Mapper(reader, ref index);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index);
                    }
                    vendors.Add(model);
                }

                );
            Paged<VendorProductsCities> result = new Paged<VendorProductsCities>(vendors, pageIndex, pageSize, totalCount);
            return result;
        }

        public List<VendorImgUrl> GetEventId(int eventId)
        {
            List<VendorImgUrl> list = null;
            VendorImgUrl model = null;
            _dataProvider.ExecuteCmd(
                "dbo.Vendors_SelectByEventId_V2",
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@EventId", eventId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (list == null)
                    {
                        list = new List<VendorImgUrl>();
                    }
                    int index = 0;
                    model = new VendorImgUrl();
                    model.Id = reader.GetSafeInt32(index++);
                    model.BusinessId = reader.GetSafeInt32(index++);
                    model.VendorName = reader.GetSafeString(index++);
                    model.VendorDescription = reader.GetSafeString(index++);
                    model.Headline = reader.GetSafeString(index++);
                    model.PriceMin = reader.GetSafeInt32(index++);
                    model.PriceMax = reader.GetSafeInt32(index++);
                    model.DateCreated = reader.GetSafeDateTime(index++);
                    model.DateModified = reader.GetSafeDateTime(index++);
                    model.ImageTitle = reader.GetSafeString(index++);
                    model.ImageUrl = reader.GetSafeString(index++);
                    list.Add(model);
                }
                );
            return list;
        }

        public Paged<VendorImgUrl> GetEventIdPaginated(int eventId, int pageIndex, int pageSize)
        {
            List<VendorImgUrl> list = null;
            VendorImgUrl model = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(
                "dbo.Vendors_SelectByEventIdPaginated",
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@EventId", eventId);
                    paramCol.AddWithValue("@PageIndex", pageIndex);
                    paramCol.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (list == null)
                    {
                        list = new List<VendorImgUrl>();
                    }
                    int index = 0;
                    model = new VendorImgUrl();
                    model.Id = reader.GetSafeInt32(index++);
                    model.BusinessId = reader.GetSafeInt32(index++);
                    model.VendorName = reader.GetSafeString(index++);
                    model.VendorDescription = reader.GetSafeString(index++);
                    model.Headline = reader.GetSafeString(index++);
                    model.PriceMin = reader.GetSafeInt32(index++);
                    model.PriceMax = reader.GetSafeInt32(index++);
                    model.DateCreated = reader.GetSafeDateTime(index++);
                    model.DateModified = reader.GetSafeDateTime(index++);
                    model.ImageTitle = reader.GetSafeString(index++);
                    model.ImageUrl = reader.GetSafeString(index++);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    list.Add(model);
                }
                );
            Paged<VendorImgUrl> result = new Paged<VendorImgUrl>(list, pageIndex, pageSize, totalCount);
            return result;
        }

        public void Insert(VendorsAndLocationsAddRequest model, int currentUserId)
        {
            _dataProvider.ExecuteNonQuery(
                "dbo.LocationsandVendorLocations_Insert",
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@UserId", currentUserId);
                    paramCol.AddWithValue("@CountryId", 1);
                    paramCol.AddWithValue("@VendorId", model.VendorId);

                    SqlParameter p = new SqlParameter("@VendorCities", System.Data.SqlDbType.Structured);
                    if (model.VendorCities != null && model.VendorCities.Any())
                    {
                        p.Value = new Data.VendorCitiesTable(model.VendorCities);
                    }
                    paramCol.Add(p);
                }
                );
        }

        public Paged<VendorWithContact> GetByUserId(int pageIndex, int pageSize, int currentUserId)
        {
            Paged<VendorWithContact> results = null;
            List<VendorWithContact> vendorList = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(
                "dbo.Vendors_SelectByUserIdPaginated",
                inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@UserId", currentUserId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    VendorWithContact model = VendorWithContactMapper(reader, ref index);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    if (vendorList == null)
                    {
                        vendorList = new List<VendorWithContact>();
                    }
                    vendorList.Add(model);
                }
        );
            if (vendorList != null)
            {
                results = new Paged<VendorWithContact>(vendorList, pageIndex, pageSize, totalCount);
            };
            return results;
        }

        public void Delete(int vendorId, int locationId)
        {
            _dataProvider.ExecuteNonQuery(
                "dbo.VendorLocations_Delete",
                inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@VendorId", vendorId);
                    param.AddWithValue("@LocationId", locationId);
                }
                );
        }
    }
}