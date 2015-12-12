
<!DOCTYPE html>

<html>
<head>
	<title data-i18n>User study</title>

	<style>
		body{ font-family: sans-serif; padding: 0.25em; }
		p{ padding:0.25em; width:800px; }
		#header{

		}
		#content{

		}
		#footer{

		}
		#instructions{

		}
		#instruction-video{
			border: 3px solid gray;
			width:420px;
		}
		#login{
			width:420px;
		}
		#login button{
			font-size: 1.25em;
			float:right;
		}
		#login-username-caption{
			padding-right: 1em;
		}
	</style>
</head>

<body>

	<div id='header'>
		<h2>Welcome to our user study!</h2>
	</div>

	<div id='content'>
		<div id='instructions'>
			<p>
				In this study, we are looking to study how humans correspond objects, which are
				from the same class but can be very structurally different.
			</p>
			<p>
				You will be asked to label 15 shapes and match 20 shape pairs.
			</p>
			<p>
				The following video shows an example of how to do label/match tasks:
			</p>
			<div id='instruction-video'>
				<iframe width="420" height="315" src="https://www.youtube.com/embed/VqW2tWT5jEA" 
					frameborder="0" allowfullscreen></iframe>
			</div>
			<p>
				Please specify a username, then click on 'start' to begin.
			</p>
		</div>
		<div id='login'>
			<form id='login-form' action='userstudy.php'>
				<span id='login-username-caption'> Username </span> <input type='text' name='username' value='user'/>
				<span> </span> <button>Start ></button>
			</form>	
		</div>
	</div>

	<div id='footer'>
	</div>
</body>

</html>