using Models;
using Models.Domain;
using Models.Requests;
using System.Collections.Generic;

namespace Services
{
    public interface IVendorsService
    {
        int Insert(VendorAddRequest model);

        void Insert(VendorsAndLocationsAddRequest model, int currentUserId);

        Paged<VendorProductsCities> SearchVendors(string searchTerm, int pageIndex, int pageSize);

        Paged<VendorProductsCities> GetPaginated(int pageIndex, int pageSize);

        Paged<VendorProductsCities> SearchCity(string city, int pageIndex, int pageSize);

        Paged<VendorProductsCities> SearchGeo(double lat, double lng, double radius, int pageIndex, int pageSize);

        Paged<VendorProductsCities> DuoSearch(double lat, double lng, double radius, string searchTerm, int pageIndex, int pageSize);

        List<VendorImgUrl> GetEventId(int eventId);

        Paged<VendorImgUrl> GetEventIdPaginated(int eventId, int pageIndex, int pageSize);

        Paged<VendorWithContact> GetByUserId(int pageIndex, int pageSize, int currentUserId);

        void Delete(int vendorId, int locationId);
    }
}