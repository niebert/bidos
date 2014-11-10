

model: user
-----------

first name
last name
password
email


user role: practitian
---------------------

### authentification

/lf0010/    register account
/lf0020/    login
/lf0030/    logout
/lf0040/    forgot password

### private config

/lf0110/    view config
/lf0120/    edit config
/lf0130/    save config
/lf0140/    delete config
/lf0150/    load config
/lf0160/    print config

### private profile

/lf0210/    view profile
/lf0220/    add new scholar to group

### data input

/lf0310/    rate scholar via questionary
/lf0320/    add custom questionary item

### search

/lf0410/    search for pupil
/lf0420/    filter pupils by property
/lf0430/    search for questionary items

user role: scientist
--------------------

### authentification

/lf0510/    register account
/lf0520/    login
/lf0530/    logout
/lf0540/    forgot password

### private config

/lf0610/    view config
/lf0620/    edit config
/lf0630/    save config
/lf0640/    delete config
/lf0650/    load config
/lf0660/    print config

### private profile

/lf0710/    view profile
/lf0720/    add new scholar to group

### search

/lf0810/    search for pupil by id
/lf0820/    search for group by property

### export data

/lf0910/    export to csv/json/yaml

user role: admin
----------------

### system configuration

/lf1010/    configure system

### user management 

/lf1110/    accept/reject user registration
/lf1120/    configure user account scope
/lf1130/    edit/delete user account

persistent data
---------------

/ld100/     store data in database [BE]

data integrity
--------------

/ll100/     database must always be valid [BE]
/ll200/     database only accepts valid data [FE]
/ll210/     don't clear form when input is faulty