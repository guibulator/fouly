//TODO: deals with placeId refresh.
/**
 * Place IDs are exempt from the caching restrictions stated in Section 3.2.4(a) of the Google Maps Platform Terms of Service. You can therefore store place ID values for later use.

You may occasionally receive a NOT_FOUND status code when you use a saved place ID. Best practice is to refresh your stored place IDs periodically. You can refresh Place IDs free of charge, by making a Place Details request, specifying only the ID field in the fields parameter. This will trigger the Places Details - ID Refresh SKU. However, this request might also return NOT_FOUND status code. One strategy is to store the original request that returned each place ID. If a place ID becomes invalid, you can re-issue that request to get fresh results. These results may or may not include the original place. The request is chargeable.

A place ID may become obsolete if a business closes or moves to a new location.

Place IDs may change due to large-scale updates on the Google Maps database. In such cases, a place may receive a new place ID, and the old ID returns a NOT_FOUND response.

In particular, some types of place IDs may sometimes cause a NOT_FOUND response, or the API may return a different place ID in the response. These place ID types include:

Street addresses that do not exist in Google Maps as precise addresses, but are inferred from a range of addresses.
Segments of a long route, where the request also specifies a city or locality.
Intersections.
Places with an address component of type subpremise.
These IDs often take the form of a long string. Example:
 * 
 */
