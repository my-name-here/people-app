

[**Initial prompt:	1**](#initial-prompt:)

[**Feature prompts	1**](#feature-prompts)

[1.(.env)	1](#1.\(.env\))

[2.(timezone for people)	2](#2.\(timezone-for-people\))

[3.(export button)	2](#3.\(export-button\))

[4.(dark mode settings)	4](#4.\(dark-mode-settings\))

[5.(group name tags on people list)	4](#5.\(group-name-tags-on-people-list\))

[**UI Prompts:	5**](#ui-prompts:)

[1.(fixing contrast)	5](#1.\(fixing-contrast\))

[2.(Aligning buttons in add person form)	5](#2.\(aligning-buttons-in-add-person-form\))

[3.(adding x button to person form)	5](#3.\(adding-x-button-to-person-form\))

[4.(logout button positioning)	5](#4.\(logout-button-positioning\))

[5.(resizing login page, and main pages to go with it.)	5](#5.\(resizing-login-page,-and-main-pages-to-go-with-it.\))

[**All Prompts:	6**](#all-prompts:)

### Initial prompt: {#initial-prompt:}

Create a web app that lets the user keep track of important persons they come across in their research. The home page should list the persons already entered. The home page should also have a \+ button that when clicked opens a second window, which allows a new person to be added.

Response:  
Generated an app that allows you to add people

Initial version:  
Has 2 pages, one for groups, where you can make a group of multiple people, and one for people, where you can add pages for multiple people. There are notes sections for each person, where you can store text, and you can add profile pictures. You have a login page, so you can log in for your data. All people data is persistent in a firebase db.

### Feature prompts {#feature-prompts}

#### 1.(.env) {#1.(.env)}

Prompt:  
please move all api keys and sensitive data to a .env file.

Result:  
Separated firebase config into .env with the Cloudinary stuff. Added a .env.example, for example of what it should be, updated files to use the .env file, and worked to make the .env be in the .gitignore.

#### 2.(timezone for people) {#2.(timezone-for-people)}

Prompt:  
each person should have a dropdown menu in the setup, which will allow you to select their timezone. this timezone will be saved, and on the people list, each person will have a section showing the current time in that persons timezone. the edit and add person pages should both have the timezone dropdown, while the people list should have the current time display.

Result:  
It works, though all existing profile pictures seem to have gone missing. New profile pictures work fine. It is missing some time zones, from using a small hard coded list of timezones.  
I sent another prompt of:  
 well, that works, though some timezones are not options, and existing profile pictures are no longer displayed. new profile pictrures look to work fine

That didn’t fix the problem, so I went back and figured out where the problem could be, using the prompt:  
I think the problem is that the data originally used profilePictureUrl, and now uses imageUrl

That fixed the images not showing up in the edit page, but profile pictures still didn’t show up, and closing the edit page didn’t work in some cases, so I did:

the pictures still don't show up for existing ones, but if i go in and edit, they appear. it looks like if there is missing data when editing, you cannot close the edit page, with either the x, cancel, or the update.

This fixed the profile pictures, but editing still couldn’t be closed, so I did:  
ok, it looks like the x and cancel buttons just don't work peroid on the edit person pages

That didn’t seem to do anything, so I tried:  
the cancel and the x button still do not close the form, though hitting update, even when no change made, seems to close the form.

That fixed the closing of the edit form.

I discovered that the add person button caused an error, so I used the prompt:  
when I hit the add person button, the screen goes blank, and i see the following error in console  
TypeError: undefined is not an object (evaluating 'initialData.profilePictureUrl')An error occurred in the \<PersonForm\> component.  
please fix this error for me

This seems to have fixed the error.

#### 3.(export button) {#3.(export-button)}

Prompt:  
ok, now can you add a button that exports the data from the people list and group list to a csv? this button should be on a new page, perhaps called settings or data

Result:  
It added the buttons on a new settings page, but the buttons each gave an error. I would also prefer to have a single export button, but that will happen after fixing the errors.

I then used a prompt of:  
the buttons show up on the settings page, but i get TypeError: undefined is not an object (evaluating 'person.groupIds.join') when pressing the export people list and get TypeError: undefined is not an object (evaluating 'group.memberIds.length') when pressing export group list.

This fixed the export, but the output files seemed to be missing info like the profile pictures  in the people, and the actual members in the group list

To try to fix this, I used a prompt of :  
the export looks to work fine, however there doesn't seem to be all the information needed within the exports, for example, there is no profile picture in the people export, and the groups list seems to be missing what people are actually in the group. there should be all the information that would be needed to recreate the db from scratch. 

This added the profile pictures, and some  user id fields, but the user ids were the same for all elements in both the people list and the profile list. It also added a new export all button 

I tried a prompt of:  
well, the profile pictures show up, and the group memebers look fine, however every element in both the group list and the people list has a user id, and this user id is the same for every element.

This seemed to fix the problem, but there is still a field in the people list of group ids, which seems to be only appearing in one row, and has the same value repeated 4 times, separated by semicolons.

I attempted to fix this with a prompt of:  
well the user id is now gone, but there is still the groupid column in the people list, which seems to be empty except for a single row, which contains the same string 4 times, seperated by semicolons. this doesn't seem like it is neccecary, as the groups each person is in is supposed to be stored in the groups list.

This fixed the data, though there is still separate export all and export for the individual lists, which seems confusing. To fix this, I tried a prompt of:

this seems fine, but the settings page has an export all, export people and export groups button, which seems like it is confusing, as you have 3 differnet export buttons, which export part of the data or all of it.

Things started exporting as a single file, and there was a single button, but the group members seemed to be missing. I attempted to fix this with a prompt of 

the groups data in this export seems to be missing the group members, and it seems confusing to have people and groups in the same rows section, I think exporting as json instead of csv might work better, having a separate field for the groups and people, allowing you to export it to a single file while keeping them separate

This fixed the export data, but the button is not centered, and the filename is just people-app-backup-date.json, and having a timestamp in it would be nice. I first fixed the timestamp on the file, as the centered button can be dealt with later if it is a problem

I used a prompt of:  
the export seems fine, but I would prefer there to be a time in the filename in addition to the date that is already in there. the date and time should be in the format of exactly "yyyy-mm-dd-hh:mm:ss". note that the colons are intentional, and should be included in the filename.

This added a timestamp, but it put \_ instead of colon.

I attempted to fix it with the prompt:  
the file is being saved as people\_app\_backup\_yyyy-mm-dd-hh\_mm\_ss.json, not people\_app\_backup\_yyyy-mm-dd-hh:mm:ss.json as requested. Please fix this.

This made it explicitly form the filename with the colons, but the file was still downloaded with \_ instead. 

I decided to try a prompt of:  
 Even though you are now explicitly forming the file with the colons, the file still has the \_ instead when  you download it. Is this a limitation of the system, or is there some other bug

This gave a response saying browsers automatically remove colons and replace them, since filenames with : are not supported on most OS.

I then had it simplify the code using a prompt of:

 can you please make it go back to using the iso datetime, instead of explicitly creating the filename?

This slightly changed the filename, to have a T and a Z, but it now fits with standard time formats.(iso)

#### 4.(dark mode settings) {#4.(dark-mode-settings)}

Prompt:  
Now add a dark mode dropdown on the settings page. This should allow you to select between dark mode, light mode, and matching system dark mode settings. When dark mode is on, the ui should update accordingly. make sure the ui updates whenever you change the dark mode setting.

Result:  
I got a working darkmode, but the people cards and group cards are still light, rather than dark. 

I tried fixing this with the prompt of:  
that mostly worked, but the cards for the people and groups are both still white on dark mode. while some fonts are occasionally white as well, this is less important, as it keeps the text readable.

That fixed darkmode, but some text was grey while others is white, which should probably be changed for consistency

I tried fixing it with the prompt:  
The text within the  .settings-container  h2 and .section-header h2 styling  all seem to be kind of bluish grey in dark mode, and a little hard to read. their color should be black in light mode, and then consistent with the rest of the interface in dark mode. note that the problem is specifically in the h2, not in h3. everything else seems fine about them, just the color is off. note that .section-header is defined in app.css

This seemed to fix the problem

#### 5.(group name tags on people list) {#5.(group-name-tags-on-people-list)}

Prompt:  
now make it so that the groups a person is in shows up as tags with the group name on the people cards. this should be added on only to people cards for people who are in at least one group, since not everyone is in a group. if a person is in multiple groups, they should have multiple group name tags.

This seemed to work , though it took 2 tries, and I accidentally  went back to an earlier version, and had to restore from github.

### UI Prompts: {#ui-prompts:}

#### 1.(fixing contrast) {#1.(fixing-contrast)}

Prompt:  
please make sure all text has enough contrast to be easily readable in both dark and light mode. this includes text in the add group and add person forms, as well as text  visible on pages.

This made the contrast, especially on the adding forms, better, so things were actually readable

#### 2.(Aligning buttons in add person form) {#2.(aligning-buttons-in-add-person-form)}

Prompt:  
Please make sure the add person and cancel buttons in the add person form are aligned.

This aligned the buttons by putting them next to each other

#### 3.(adding x button to person form) {#3.(adding-x-button-to-person-form)}

Prompt:   
Add an x button to the top right corner of the add person form, that acts the same as the cancel button.

This added the x button as requested

#### 4.(logout button positioning) {#4.(logout-button-positioning)}

Prompt:  
move the logout  button to be a link in the navbar instead

This positioned the logout button where I wanted it.

#### 5.(resizing login page, and main pages to go with it.) {#5.(resizing-login-page,-and-main-pages-to-go-with-it.)}

Prompt:  
make the login page be wider, so it is closer in width to the pages you see when logged in currently, it is so small that the email and password inputs don't even fit in it.

That didn’t really do much, so I added a prompt of :  
that didn't seem to do much, and the login page is barely wide enough to contain the elements on it, and the main app is much wider

This made everything much wider, and had every page take up the full width. 

This was a little too wide, so I tried this prompt:  
Instead of having every  page take up 100% of the width of the window, can you make it take up 90%, and center the content in the window?

This did what I wanted, and made it a more reasonable size.

### All Prompts: {#all-prompts:}

Refinements:  
Prompt:  
please move all api keys and sensitive data to a .env file.

Result:  
Separated firebase config into .env with the Cloudinary stuff. Added a .env.example, for example of what it should be, updated files to use the .env file, and worked to make the .env be in the .gitignore.

Prompt:  
each person should have a dropdown menu in the setup, which will allow you to select their timezone. this timezone will be saved, and on the people list, each person will have a section showing the current time in that persons timezone. the edit and add person pages should both have the timezone dropdown, while the people list should have the current time display.

Result:  
It works, though all existing profile pictures seem to have gone missing. New profile pictures work fine. It is missing some time zones, from using a small hard coded list of timezones.  
I sent another prompt of:  
 well, that works, though some timezones are not options, and existing profile pictures are no longer displayed. new profile pictrures look to work fine

That didn’t fix the problem, so I went back and figured out where the problem could be, using the prompt:  
I think the problem is that the data originally used profilePictureUrl, and now uses imageUrl

That fixed the images not showing up in the edit page, but profile pictures still didn’t show up, and closing the edit page didn’t work in some cases, so I did:

the pictures still don't show up for existing ones, but if i go in and edit, they appear. it looks like if there is missing data when editing, you cannot close the edit page, with either the x, cancel, or the update.

This fixed the profile pictures, but editing still couldn’t be closed, so I did:  
ok, it looks like the x and cancel buttons just don't work peroid on the edit person pages

That didn’t seem to do anything, so I tried:  
the cancel and the x button still do not close the form, though hitting update, even when no change made, seems to close the form.

That fixed the closing of the edit form.

I discovered that the add person button caused an error, so I used the prompt:  
when I hit the add person button, the screen goes blank, and i see the following error in console  
TypeError: undefined is not an object (evaluating 'initialData.profilePictureUrl')An error occurred in the \<PersonForm\> component.  
please fix this error for me

This seems to have fixed the error.

Prompt:  
ok, now can you add a button that exports the data from the people list and group list to a csv? this button should be on a new page, perhaps called settings or data

Result:  
It added the buttons on a new settings page, but the buttons each gave an error. I would also prefer to have a single export button, but that will happen after fixing the errors.

I then used a prompt of:  
the buttons show up on the settings page, but i get TypeError: undefined is not an object (evaluating 'person.groupIds.join') when pressing the export people list and get TypeError: undefined is not an object (evaluating 'group.memberIds.length') when pressing export group list.

This fixed the export, but the output files seemed to be missing info like the profile pictures  in the people, and the actual members in the group list

To try to fix this,Ii used a prompt of :  
the export looks to work fine, however there doesn't seem to be all the information needed within the exports, for example, there is no profile picture in the people export, and the groups list seems to be missing what people are actually in the group. there should be all the information that would be needed to recreate the db from scratch. 

This added the profile pictures, and some  user id fields, but the user ids were the same for all elements in both the people list and the profile list. It also added a new export all button 

I tried a prompt of:  
well, the profile pictures show up, and the group memebers look fine, however every element in both the group list and the people list has a user id, and this user id is the same for every element.

This seemed to fix the problem, but there is still a field in the people list of group ids, which seems to be only appearing in one row, and has the same value repeated 4 times, separated by semicolons.

I attempted to fix this with a prompt of:  
well the user id is now gone, but there is still the groupid column in the people list, which seems to be empty except for a single row, which contains the same string 4 times, seperated by semicolons. this doesn't seem like it is neccecary, as the groups each person is in is supposed to be stored in the groups list.

This fixed the data, though there is still separate export all and export for the individual lists, which seems confusing. To fix this, I tried a prompt of:

this seems fine, but the settings page has an export all, export people and export groups button, which seems like it is confusing, as you have 3 differnet export buttons, which export part of the data or all of it.

Things started exporting as a single file, and there was a single button, but the group members seemed to be missing. I attempted to fix this with a prompt of 

the groups data in this export seems to be missing the group members, and it seems confusing to have people and groups in the same rows section, I think exporting as json instead of csv might work better, having a separate field for the groups and people, allowing you to export it to a single file while keeping them separate

This fixed the export data, but the button is not centered, and the filename is just people-app-backup-date.json, and having a timestamp in it would be nice. I first fixed the timestamp on the file, as the centered button can be dealt with later if it is a problem

I used a prompt of:  
the export seems fine, but I would prefer there to be a time in the filename in addition to the date that is already in there. the date and time should be in the format of exactly "yyyy-mm-dd-hh:mm:ss". note that the colons are intentional, and should be included in the filename.

This added a timestamp, but it put \_ instead of colon.

I attempted to fix it with the prompt:  
the file is being saved as people\_app\_backup\_yyyy-mm-dd-hh\_mm\_ss.json, not people\_app\_backup\_yyyy-mm-dd-hh:mm:ss.json as requested. Please fix this.

This made it explicitly form the filename with the colons, but the file was still downloaded with \_ instead. 

I decided to try a prompt of:  
 Even though you are now explicitly forming the file with the colons, the file still has the \_ instead when  you download it. Is this a limitation of the system, or is there some other bug

This gave a response saying browsers automatically remove colons and replace them, since filenames with : are not supported on most OS.

I then had it simplify the code using a prompt of:

 can you please make it go back to using the iso datetime, instead of explicitly creating the filename?

This slightly changed the filename, to have a T and a Z, but it now fits with standard time formats.(iso)

Prompt:  
Now add a dark mode dropdown on the settings page. This should allow you to select between dark mode, light mode, and matching system dark mode settings. When dark mode is on, the ui should update accordingly. make sure the ui updates whenever you change the dark mode setting.

Result:  
I got a working darkmode, but the people cards and group cards are still light, rather than dark. 

I tried fixing this with the prompt of:  
that mostly worked, but the cards for the people and groups are both still white on dark mode. while some fonts are occasionally white as well, this is less important, as it keeps the text readable.

That fixed darkmode, but some text was grey while others is white, which should probably be changed for consistency

I tried fixing it with the prompt:  
The text within the  .settings-container  h2 and .section-header h2 styling  all seem to be kind of bluish grey in dark mode, and a little hard to read. their color should be black in light mode, and then consistent with the rest of the interface in dark mode. note that the problem is specifically in the h2, not in h3. everything else seems fine about them, just the color is off. note that .section-header is defined in app.css

This seemed to fix the problem

Prompt:  
now make it so that the groups a person is in shows up as tags with the group name on the people cards. this should be added on only to people cards for people who are in at least one group, since not everyone is in a group. if a person is in multiple groups, they should have multiple group name tags.

This seemed to work , though it took 2 tries, and I accidentally  went back to an earlier version, and had to restore from github.

Prompt:  
please make sure all text has enough contrast to be easily readable in both dark and light mode. this includes text in the add group and add person forms, as well as text  visible on pages.

This made the contrast, especially on the adding forms, better, so things were actually readable

Prompt:  
Please make sure the add person and cancel buttons in the add person form are aligned.

This aligned the buttons by putting them next to each other

Prompt:   
Add an x button to the top right corner of the add person form, that acts the same as the cancel button.

This added the x button as requested

Prompt:  
move the logout  button to be a link in the navbar instead

This positioned the logout button where I wanted it.

Prompt:  
make the login page be wider, so it is closer in width to the pages you see when logged in currently, it is so small that the email and password inputs don't even fit in it.

That didn’t really do much, so I added a prompt of :  
that didn't seem to do much, and the login page is barely wide enough to contain the elements on it, and the main app is much wider

This made everything much wider, and had every page take up the full width. 

This was a little too wide, so I tried this prompt:  
Instead of having every  page take up 100% of the width of the window, can you make it take up 90%, and center the content in the window?

This did what I wanted, and made it a more reasonable size.

