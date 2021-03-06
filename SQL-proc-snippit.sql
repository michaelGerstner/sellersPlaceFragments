USE [C70_SellersPlace]
GO
/****** Object:  StoredProcedure [dbo].[Events_SelectByIdV2]    Script Date: 5/6/2019 2:40:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Events_SelectByIdV2]
					@Id int

AS

/*

	DECLARE @Id int = 12
	EXECUTE dbo.Events_SelectByIdV2 @Id

*/

BEGIN

	SELECT [Id]
		  ,[EventTypeId]
		  ,[Name]
		  ,[Summary]
		  ,[Headline]
		  ,[Description]
		  ,[VenueId]
		  ,[EventStatusId]
		  ,[License]
		  ,[IsFree]
		  ,[DateCreated]
		  ,[DateModified]
		  ,[SetupTime]
		  ,[DateStart]
		  ,[DateEnd]
		  ,[PromoterId]
	FROM dbo.Events
	WHERE Id = @Id

END

GO
/****** Object:  StoredProcedure [dbo].[Events_SelectByPromoterIdPaginatedV3]    Script Date: 5/6/2019 2:40:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Events_SelectByPromoterIdPaginatedV3]
	   
		  @PromoterId int
		  ,@PageIndex int
		  ,@PageSize int

AS

/* ---Test Script
    
	   DECLARE @PromoterId int = 90
			 ,@PageIndex int = 0
			 ,@PageSize int = 5

		  EXECUTE dbo.Events_SelectByPromoterIdPaginatedV3 @PromoterId, @PageIndex, @PageSize

*/
BEGIN

	  DECLARE @CurrentDate datetime2(7) = getutcdate()

	 SELECT Distinct e.[Id]
		 ,[EventTypeId]
		 ,e.[Name]
		 ,[Summary]
		 ,e.[Headline]
		 ,e.[Description]
		 ,[VenueId]
		 ,[EventStatusId]
		 ,[License]
		 ,[IsFree]
		 ,e.[DateCreated]
		 ,e.[DateModified]
		 ,[SetupTime]
		 ,[DateStart]
		 ,[DateEnd]
		 ,PromoterId
		 ,v.[Name]
		 ,l.[LineOne]
		 ,l.[LineTwo]
		 ,l.[City]
		 ,l.[Zip]
		 ,l.[Latitude]
		 ,l.[Longitude]
		 ,i.Url as MainImage
		 ,TotalCount = Count(1) over()										  
    FROM dbo.Events e
    INNER JOIN dbo.Venues v on e.VenueId = v.Id
    INNER JOIN dbo.Locations l on v.AddressId = l.Id
    INNER JOIN dbo.State s on  s.Id = l.StateId
    INNER JOIN dbo.Promoters p on e.PromoterId = p.id
	left outer JOIN dbo.Images as i on e.Id = i.EntityId and i.EntityTypeId = 12

    WHERE @PromoterId = e.PromoterId and @CurrentDate <= e.DateStart and EventStatusId = 1

	ORDER BY e.DateStart		
	offset (@PageIndex) * @PageSize rows
	fetch next @PageSize rows only
END
GO
/****** Object:  StoredProcedure [dbo].[Events_SelectByVendorId]    Script Date: 5/6/2019 2:40:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Events_SelectByVendorId]
		   @VendorId int
		  ,@PageIndex int
		  ,@PageSize int


AS

/*  --------TEST CODE---------

		DECLARE @VendorId int = 121
			  ,@PageIndex int = 0
			  ,@PageSize int = 6

		EXECUTE dbo.Events_SelectByVendorId 
									   @VendorId
									  ,@PageIndex
									  ,@PageSize

*/  -------Created By Caroline-----

BEGIN
			 DECLARE @OFFSET int = @PageIndex * @PageSize
			 DECLARE @CurrentDate datetime2(7) = GETUTCDATE();

			 SELECT   e.[Id] AS EventId
				    ,e.[EventTypeId]
				    ,e.[Name]
				    ,e.[Summary]
				    ,e.[Headline]
				    ,e.[Description]
				    ,e.[VenueId]
				    ,e.[EventStatusId]
				    ,e.[License]
				    ,e.[IsFree]
				    ,e.[DateCreated]
				    ,e.[DateModified]
				    ,e.[SetupTime]
				    ,e.[DateStart]
				    ,e.[DateEnd]
				    ,e.[PromoterId]
				    ,i.[Url] AS ImageUrl
				    ,v.[Name] AS VenueName
				    ,l.[LineOne]
				    ,l.[LineTwo]
				    ,l.[City]
				    ,l.[Zip]
				    ,l.[Latitude]
				    ,l.[Longitude]
				    ,TotalCount= COUNT(1) OVER()
			   FROM dbo.Events AS e
			   INNER JOIN dbo.Venues AS v
				ON e.[VenueId] = v.[Id]
			   INNER JOIN dbo.Locations AS l
				ON v.[AddressId] = l.[Id]
			   LEFT JOIN dbo.Images AS i
				ON e.[Id] = i.[EntityId] AND i.[EntityTypeId] = 12
			   INNER JOIN dbo.EventsVendors AS ev
				ON e.[Id] = ev.[EventId]
			   WHERE ev.[VendorId] = @VendorId 
				AND e.[DateStart] >= @CurrentDate
			   ORDER BY e.[DateStart]

			   OFFSET @OFFSET ROWS
			   FETCH NEXT @PageSize ROWS ONLY


END
GO
/****** Object:  StoredProcedure [dbo].[VendorsProductsLocationsContact_SearchGeoText_V2]    Script Date: 5/6/2019 2:40:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[VendorsProductsLocationsContact_SearchGeoText_V2]

		  @Lat float
		  ,@Lng float
		  ,@Radius int
		  ,@SearchTerm nvarchar(50)
		  ,@PageIndex int
		  ,@PageSize int
	
AS
/*--Test Script IN PROGRESS DO NOT USE

    DECLARE  @Lat float = 33.8358492
		  ,@Lng float = -118.3406
		  ,@Radius int = 80467.19899473937
		  ,@SearchTerm nvarchar(50) = ''
		  ,@PageIndex int = 0
		  ,@PageSize int = 999

    EXECUTE dbo.VendorsProductsLocationsContact_SearchGeoText_V2 @Lat, @Lng, @Radius, @SearchTerm, @PageIndex, @PageSize

    DECLARE @Lat float = 33.8358492
    DECLARE @Long float = -118.3406


    DECLARE @g geography = geography::Point(@Lat, @Long, 4326)


    SELECT c.City
        ,c.Lat
        ,c.Long
    from dbo.Cities c
*/
BEGIN
    
    DECLARE @Offset int = @PageSize * @PageIndex
    DECLARE @InRadius dbo.IntIdTable;
    DECLARE @Results dbo.IntIdTable;
    DECLARE @g geography = geography::Point(@Lat, @Lng, 4326);

    With ExistingLatLong_CTE(Id, Lat, Lng)
    AS
    (
		SELECT Id
			 ,Latitude
			 ,Longitude
		FROM dbo.Locations
		WHERE Latitude IS NOT NULL and Longitude IS NOT NULL
    )

    INSERT INTO @InRadius
		  ([Data])
    SELECT distinct v.[Id]
    FROM dbo.Vendors v
    INNER JOIN dbo.VendorLocations vl ON v.Id = vl.VendorId
    INNER JOIN ExistingLatLong_CTE ell ON ell.Id = vl.LocationId
    WHERE geography::Point(ell.Lat, ell.Lng, 4326).STDistance(@g) < @Radius

    INSERT INTO @Results
		  ([Data])
    SELECT DISTINCT ir.[Data]
    FROM @InRadius ir
	   INNER JOIN dbo.Vendors v on ir.Data = v.Id
	   LEFT OUTER JOIN dbo.VendorLocations vl on vl.VendorId = v.[Id]
	   LEFT JOIN dbo.Locations l on l.Id = vl.LocationId
	   LEFT JOIN dbo.Products p on p.VendorId = v.[Id]
	   LEFT JOIN dbo.VendorOfferings vo on vo.VendorId = v.[Id]
	   LEFT JOIN dbo.OfferingsLookup ol on ol.Id = vo.OfferingLookupId
    WHERE (v.[Name] LIKE '%' + @SearchTerm + '%' OR v.[Description] LIKE '%' + @SearchTerm + '%'
		  OR [Headline] LIKE '%' + @SearchTerm + '%' OR l.City LIKE '%' + @SearchTerm + '%'
		  OR l.Name LIKE '%' + @SearchTerm + '%' OR l.Zip LIKE '%' + @SearchTerm + '%'
		  OR p.Name LIKE '%' + @SearchTerm + '%' OR p.Description LIKE '%' + @SearchTerm + '%' 
		  OR ol.Name LIKE '%' + @SearchTerm + '%');

    SELECT v.Id 
		,[BusinessId]
		,v.[Name] as VendorName 
		,v.[Description] as VendorDescription
		,[Headline]
		,[PriceMin] 
		,[PriceMax]
		,v.[DateCreated] as VendorDateCreated
		,v.[DateModified] as VendorDateModified
		,(
			 SELECT  i.Url 
			 FROM    dbo.Images i 
			 where   i.EntityId = v.Id  
				    and i.EntityTypeId = 10
		  ) AS Logo

		,(
			SELECT DISTINCT p.Name as 'Name'
				    ,p.Description as 'Description'
				    ,ImgUrls.Url as 'ImgUrl'
			FROM dbo.Products p 
			INNER JOIN dbo.Vendors ON v.Id = p.VendorId				 
			INNER JOIN dbo.Images ImgUrls ON ImgUrls.Id = p.ImageId for JSON AUTO
				    

		 ) AS Products

		,(	 
			SELECT DISTINCT l.City as 'city' 
			FROM dbo.Locations l
			INNER JOIN dbo.VendorLocations vl ON vl.VendorId = v.Id
			WHERE l.Id = vl.LocationId FOR JSON AUTO
		) AS Cities

		,(		
			SELECT DISTINCT vo.Name as 'offering' 
			FROM dbo.OfferingsLookup vo
			INNER JOIN dbo.VendorOfferings o on o.OfferingLookupId = vo.Id
			where o.VendorId = v.Id FOR JSON AUTO
		) as VendorOfferings
		,v.Contact
		,u.Email
		,TotalCount = Count(1) over()
		FROM dbo.Vendors v
		INNER JOIN @Results st ON st.Data = v.Id
		INNER JOIN dbo.Businesses b ON v.BusinessId = b.Id
		INNER JOIN dbo.Users u ON u.Id = b.UserId
    ORDER BY v.Id
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY

END
GO
/****** Object:  StoredProcedure [dbo].[VendorsProductsLocationsContact_SearchPaginatedByCity_V2]    Script Date: 5/6/2019 2:40:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[VendorsProductsLocationsContact_SearchPaginatedByCity_V2]

		  @SearchTerm nvarchar(50)
		  ,@PageIndex int
		  ,@PageSize int
	
AS
/*--Test Script

    DECLARE @SearchTerm nvarchar(50) = 'Torrance'
		  ,@PageIndex int = 0
		  ,@PageSize int = 999

    EXECUTE dbo.VendorsProductsLocationsContact_SearchPaginatedByCity_V2 @SearchTerm, @PageIndex, @PageSize

*/
BEGIN
    
    DECLARE @Offset int = @PageSize * @PageIndex

    DECLARE @SearchedTable dbo.IntIdTable

    INSERT INTO @SearchedTable
		  ([Data])
    SELECT distinct v.[Id]
    FROM dbo.Vendors v
	   LEFT OUTER JOIN dbo.VendorLocations vl on vl.VendorId = v.Id
	   LEFT JOIN dbo.Locations l on l.Id = vl.LocationId
    WHERE (l.City LIKE '%' + @SearchTerm + '%')

    SELECT v.Id 
		,[BusinessId]
		,v.[Name] as VendorName 
		,v.[Description] as VendorDescription
		,[Headline]
		,[PriceMin] 
		,[PriceMax]
		,v.[DateCreated] as VendorDateCreated
		,v.[DateModified] as VendorDateModified
		,(
			 SELECT  i.Url 
			 FROM    dbo.Images i 
			 where   i.EntityId = v.Id  
				    and i.EntityTypeId = 10
		  ) AS Logo

		,(
			SELECT DISTINCT p.Name as 'Name'
				    ,p.Description as 'Description'
				    ,ImgUrls.Url as 'ImgUrl'
			FROM dbo.Products p 
			INNER JOIN dbo.Vendors ON v.Id = p.VendorId				 
			INNER JOIN dbo.Images ImgUrls ON ImgUrls.Id = p.ImageId for JSON AUTO
				    

		 ) AS Products

		,(	 
			SELECT DISTINCT l.City as 'city' 
			FROM dbo.Locations l
			INNER JOIN dbo.VendorLocations vl ON vl.VendorId = v.Id
			WHERE l.Id = vl.LocationId FOR JSON AUTO
		) AS Cities

		,(		
			SELECT DISTINCT vo.Name as 'offering' 
			FROM dbo.OfferingsLookup vo
			INNER JOIN dbo.VendorOfferings o on o.OfferingLookupId = vo.Id
			where o.VendorId = v.Id FOR JSON AUTO
		) as VendorOfferings
		,v.Contact
		,u.Email
		,TotalCount = Count(1) over()
		FROM dbo.Vendors v
		INNER JOIN @SearchedTable st ON st.Data = v.Id
		INNER JOIN dbo.Businesses b ON v.BusinessId = b.Id
		INNER JOIN dbo.Users u ON u.Id = b.UserId
    ORDER BY v.Id
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY

END
GO
