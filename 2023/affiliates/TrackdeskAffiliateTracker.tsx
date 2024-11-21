import { Helmet } from "react-helmet"

const tenantId = import.meta.env.VITE_APP_TRACKDESK_TENANT_ID

function TrackdeskAffiliateTracker() {
  return (
    <>
      <Helmet>
        {/* <!-- Trackdesk tracker begin --> */}
        <script async src="//cdn.trackdesk.com/tracking.js"></script>
        <script type="text/javascript">
          {`(function(t,d,k){(t[k]=t[k]||[]).push(d);t[d]=t[d]||t[k].f||function(){(t[d].q=t[d].q||[]).push(arguments)}})(window,"trackdesk","TrackdeskObject");
          trackdesk("${tenantId}", "click");`}
        </script>
        {/* <!-- Trackdesk tracker end --> */}
      </Helmet>
    </>
  )
}

export default TrackdeskAffiliateTracker
