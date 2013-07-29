<script>
var w = document.write.bind(document);
if (location.protocol.substr(0,4) === 'http')
  w(unescape('%3Cscript src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"%3E%3C/script%3E'));
</script>
<script>
if (typeof jQuery !== 'function')
  w(unescape('%3Cscript src="/jquery/jquery.min.js"%3E%3C/script%3E'));
</script>
