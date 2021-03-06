const request = require('request');
var query = require('../../../db/msql');
var utils = require('../../../utils');
var fs = require('fs');
//資電A 資工B 網多C
var table = {};

function queryProfile(studentId, callback){
    query.ShowUserInfo(studentId, function(err, profile){
        if(!profile){
            console.log("Can't find the student");
            return;
        }
        if(err){
            throw err;
            return;
        }
        else
            callback(profile);
    });
}

function queryPass(studentId, callback){
	query.Pass(studentId, function(err, pass){
		if(!pass){
			////console.log("Can't find the student.");
			return;
		}
		if(err){
			throw err;
			return;
		}
		else
			callback(pass);
	});
}

function queryRule(studentId, callback){
	query.graduateRule(studentId, function(err, rules){
		if(!rules){
			////console.log("Can't find the student.");
			return;
		}
		if(err){
			throw err;
			return;
		}
		else
			callback(rules);
	});

}

function queryCourse(studentId, callback){
    var info = {
            group: '',
            program: '',
    };
	query.ShowUserInfo(studentId, function(err,result){
		if(err){
		//	console.log("Can't find student");
			throw err;
			return;
		}
		if(!result){
		//	console.log("no result");
            return;
        }
        //console.log("result:");
		result = JSON.parse(result);
        //console.log(result);
		info.program = result[0].program;
	        query.Group(studentId, function(err, result){
			if(!result){
				////console.log("Cannot find the student.");
				return;
			}
			if(err){
				throw err;
				return;
			}
                	else{
                    		info.group = result;
                    		////console.log("tablequerycourseelse");
	           	 	processCourse(info, function(course){		
                        		callback(course);
                    		});
			}
                });
	});
}

function processCourse(info, callback){
         
	var program = info.program.substring(0,2);
        var result = info.group;
	var course = {
                compulse: [],
                core: [],
                vice:[],
                others: [],
                elective:[],
		total:[]
        }
	result = JSON.parse(result);
	course.total = result;
	if(program == '資電' ){
		for(var i = 0; i < result.length; i++){
			switch(result[i].type){
				case '必修' :
					course.compulse.push(result[i]);
					break;  
				case '核心' :
					course.core.push(result[i]);
					break;  
				case '副核心' :
					course.vice.push(result[i]);
					break;  
				case '網多核心': case '資工核心' :
					course.others.push(result[i]);
					break;  
			} 
		 }
                callback(course);
	}
	else if(program == '資工'){
		for(var i = 0; i < result.length; i++){

			switch(result[i].type){
				case '必修' :
					course.compulse.push(result[i]);
					break;  
				case '核心' :
					course.core.push(result[i]);
					break;  
				case '副核心' :
					course.vice.push(result[i]);
					break;  
				case '資電核心': case '網多核心' :
					course.others.push(result[i]);
					break;  
			} 

		}
                callback(course);
	}
	else if(program == '網多'){
		for(var i = 0; i < result.length; i++){
		
			switch(result[i].type){
				case '必修' :
					course.compulse.push(result[i]);
					break;
				case '核心' :
					course.core.push(result[i]);
					break;
					case '副核心' :
						course.vice.push(result[i]);
						break;
					case '資電核心': case '資工核心' :
						course.others.push(result[i]);
						break;
			}	
		
		}
                callback(course);
	}

}

function queryList(studentId, callback){
	query.studentGraduateList(studentId, function(err, list){
                if(!list){
                        console.log("Can't find the student.");
                        return;
                }
                if(err){
                        throw err;
                        return;
                }
                else
                        callback(list);
        });
}

function queryFree(studentId, callback){
	query.offset(studentId, function(err, free){
		if(!free){
			////console.log("Can't find free course list");
			return;
		}
		if(err){
			throw err;
			return;
		}
		else
			callback(free);
	});
}

function queryNow(studentId, callback){
	query.on_cos_data(studentId, function(err, now){
		if(!now){
			////console.log("Can't find now course");
			return;
		}
		if(err){
			throw err;
			return;
		}
		else
			callback(now);
	});
}

function queryGeneral(callback){
	query.general_cos_rule(function(err, general){
		if(!general){
			////console.log("Can't find geberal courses");
			return;
		}
		if(err){
			throw err;
			return;
		}
		else
			callback(general);
	});
}

function queryChange(studentId, callback){
    query.cosMotion(studentId, function(err, change){
        if(!change){
            //console.log(" No change");
            return;
        }
        if(err){
            throw err;
            return;
        }
        //console.log(change);
        else
            callback(change);
    });
}

function queryProject(studentId, callback){
    query.showResearchPage(studentId, function(err, project){
        if(!project)
            return;
        if(err){
            throw err;
            return;
        }
        else
            callback(project);
    });
}

function queryProInfoAndResearchCount(studentId, callback){	
    var info;
    var IDlist;
    query.findTeacherResearchCountAndInfo(function(err, result){
        if(err){
            throw err;
            return;
        }
        if(!result)
            return;
        result = JSON.parse(result);
		var grade = studentId.substring(0,2);
		var info = [];
		var flag;
		for(var i = 0; i < result.length; i++){
			for(var j = 0; j < result[i].gradeCnt.length; j++){
				var pic_route = '/home/joying/db_data/photo/' + result[i].teacher_id + '.jpg';
				var pic_path = 'professor/'+ result[i].teacher_id + '.jpg';
				
				var path;
				try{
						var stats = fs.statSync(pic_route);
						path = pic_path;
                    }
                    catch(err){
                        path = "";
                    }
				if(result[i].gradeCnt[j].grade == grade){
					info.push({ tname: result[i].tname,teacher_id: result[i].teacher_id, phone:result[i].phone, email: result[i].email, expertise: result[i].expertise, info : result[i].info, path : path, scount: result[i].gradeCnt[j].scount});
					flag =1;
					break;
				}						
				else
					flag = 0;
			}
			if (flag==0)
				info.push({ tname: result[i].tname,teacher_id:result[i].teacher_id, phone:result[i].phone, email: result[i].email, expertise: result[i].expertise, info : result[i].info, path : path, scount: "0" });
		}
		callback(info);
		
    });

}
function CheckStateAndCreateNewForm(info ,callback){
		var success=0;
		var state_info=[];
		//console.log(info);
		for(var i = 0;i< info.student_num; i++){
			var count=0;
			query.researchApplyFormPersonalReturn(info.participants[i],info.first_second,function(err,result){
				if(err){
					throw err;
					return;
				}
				if(!result)
					return;
				
				result = JSON.parse(result);
				count +=1;
		
				for(var j =0; j<result.length;j++){
					
					if(result[j].agree != '1' ){
						success = 0;
						break;
					}
					else 
						success = 1;					
				}
				if(result.length == 0)
					success =1;
				
				if(success ==0)
					state_info.push(0);					
				else
					state_info.push(1);	
				if(count == info.student_num){
					
					for(var k=0; k< count;k++){
		
						if(state_info[k]==0){
							var signal = {signal : 0};
							callback(signal);
							break;
						}
						if((k == count -1)&&(state_info[k])==1){
							for(var m = 0; m<info.student_num; m++){
									var Student_info = {phone : info.phones[m], student_id : info.participants[m], research_title : info.research_title, tname : info.tname,first_second : info.first_second, email : info.email[m], semester: info.semester};
									CreateNewForm(Student_info);					
							}
							var signal = {signal : 1};	
							callback(signal);
						}
					}
				}
						
			}); 
		}
}
function CreateNewForm(studentInfo){
	query.researchApplyFormCreate(studentInfo, function(err){
		if(err){
			throw err;
			return;
		}
    });
}
function queryApplyForm(studentId ,callback){
	query.researchApplyFormPersonalReturn(studentId,'1', function(err, result){
        if(!result)
            return;
        if(err){
            throw err;
            return;
        }
        else{
			
			result = JSON.parse(result);
			query.researchApplyFormPersonalReturn(studentId,'2', function(err, form){
				if(!form)
					return;
				if(err){
					throw err;
					return;
				}
				else{
					form = JSON.parse(form);
					var allForm = [...result,...form];
					callback(allForm);
					
				}
			});
		}
            
    });		
}
function PerformDelete(info ,callback){
	var formInfo = {research_title : info.research_title, tname : info.tname, first_second:info.first_second, semester: info.semester};
	query.researchApplyFormDelete(formInfo);
		
	var signal = {signal : '1'};
	callback(signal);	
}
function PerformEditProjectPage(info ,callback){
	//var set_project = {tname: req.body.tname, research_title :req.body.research_title, first_second:req.body.first_second,semester:req.body.semester,  new_title : req.body.new_title, new_link: req.body.new_link, new_intro:req.body.new_intro};
	query.setResearchPage(info, function(err){
		if(err){
			throw err;
			return;
		}
		else{
			var signal = {signal : 1};
			callback(signal);
		}
	});
	
}
function queryMentorInfo(studentId ,callback){
	
    query.mentorReturn(studentId, function(err, result){
		if(err){
			throw err;
			return;
		}
		if(!result)
			return;
		else{
			result = JSON.parse(result);
			callback(result);
		}
    });	
}
function SetProjectScore(info ,callback){
    var content = {student_id:info.student_id,tname:info.tname, research_title:info.research_title, first_second: info.first_second, semester: info.year, new_score:info.new_score, new_comment: info.comment};
    query.setResearchScoreComment(content);
	
	var signal = {signal:1};
    callback(signal);
}
function SetProjectTitle(info ,callback){
    var content = {research_title : info.research_title, tname : info.tname, first_second : info.first_second, semester:info.year, new_title : info.new_title};
	var num = query.updateResearchTitle(content);
	//console.log(num);
	var signal = {signal:1};
    callback(signal);
}
function queryProjectApplyList(teacherId ,callback){
	
    query.researchApplyFormTeaReturn(teacherId, function(err,result){
		if(err) {
                  throw err;     
                  return;
            }

            if(!result)
                 return; 
			 
            result = JSON.parse(result);
            if(result.length == 0){
                var groups = [];
            }
            else{
				var temp = result[0].research_title;
				var groups =  [];
				var project = {
					research_title: '',
					first_second:'',
					participants: [],
					year: '',
					status:''
				}
				project.research_title = temp;
				//project.status = result[i].agree;
				for(var i = 0; i<result.length; i++){
					if(result[i].agree == 3)
						continue;
					var student = {
						student_id: '',
						sname: '',
						email: '',
						phone: '',
						state: '',
						year: '',
						first_second:''
					}
					student.student_id = result[i].student_id;
					student.sname = result[i].sname;
					student.email = result[i].email;
					student.phone = result[i].phone;
					student.state = result[i].agree;
	
					student.first_second = result[i].first_second;
					student.year = result[i].semester;
					if(result[i].research_title == temp){
						project.participants.push(student);
						if(i == result.length - 1){   
	
						project.status = project.participants[0].state;
						project.first_second = project.participants[0].first_second;
						project.year = project.participants[0].year; 
						groups.push(project);
						}
					}
					else{
				
					// project.status = result[i-1].agree;
					project.first_second = project.participants[0].first_second;
					project.status = project.participants[0].state;
					project.year = project.participants[0].year;
						groups.push(project);
						temp = result[i].research_title;
						var new_project = {
							research_title: '',
							first_second:'',
							participants: [],
							year:'',
							status:''
						}
						new_project.research_title = result[i].research_title;
						new_project.participants.push(student);
						project = new_project;
						if(i == result.length - 1){
							project.status = project.participants[0].state;
							project.first_second = project.participants[0].first_second;
							project.year = project.participants[0].year;
							groups.push(project);
						}	
					}	
				}
			}
	       callback(groups) ;   
    
    });	
}
function queryProjectList(teacherId ,callback){  
    query.findTeacherResearch(teacherId, function(err, result){
        if(err){
            throw err;
            return;
        }
        if(!result)
            return;
		
		console.log(result);
        if(result.length == 0){
			var projects = {
                groups: []
            }
		}	
        else{
			var index = [];
			var temp = result[0].research_title;
			var projects = {
				grade02:0,
				grade03:0,
				grade04:0,
				grade05:0,
				total_number:0,
				groups: []
			}
	
			var count = 0;
			for(var i = 0; i<result.length; i++){
				if(index[result[i].research_title] == null){
					var project = {
							research_title: '',
							participants : [],
							year:'',
							first_second: ''
					}
					project.year = result[i].semester;
					project.research_title = result[i].research_title;
					project.first_second = result[i].first_second;
					projects.groups.push(project);
					index[result[i].research_title] = count;
					count++;
				}  
			}
	
			for(var i = 0; i<result.length; i++){
				
				var student = {
					student_id: '',
					sname: '',
					detail: '',
					score: null
				}
				student.student_id = result[i].student_id;
				student.score = parseInt(result[i].score);
				var grade = student.student_id.substring(0,2);
				
				switch(grade){
					case '02':
						projects.grade02++;
						break;
					case '03':
						projects.grade03++;
						break;
					case '04':
						projects.grade04++;
						break;
					case '05':
						projects.grade05++;
						break;
				}
				student.sname = result[i].sname;
				student.detail = result[i].class_detail;
				var id = index[result[i].research_title];
				projects.groups[id].participants.push(student);
						
			}
				projects.total_number = projects.grade04;
        }
		
        callback(projects);

    });
}
function SetApplyFormState(info ,callback){  
    if(info.agree =='1'){
		for(var i = 0; i<info.student.length;i++){
			var req_member = { student_id : info.student[i].student_id, tname:info.tname, research_title:info.research_title, first_second:info.first_second, semester: info.year};
			query.createNewResearch(req_member, function(err){
				if(err){
					throw err;
					return;
				}
			});				
		}
		var formInfo = {research_title:info.research_title, tname : info.tname, first_second:info.first_second, agree:info.agree, semester:info.year};
		query.researchApplyFormSetAgree(formInfo);
		
		var signal = {signal : 1};
		callback(signal);
				
	}
	else{
		var formInfo = {research_title : info.research_title, tname:info.tname, first_second:info.first_second, agree:info.agree, semester:info.year};
		query.researchApplyFormSetAgree(formInfo);
		
		var signal = {signal : 1};
		callback(signal);	
	}
}
function queryResearchIntro(info ,callback){  
    var Info = {research_title:info.research_title, tname:info.tname, first_second:info.first_second, semester:info.year};
	query.showResearchInfo(Info, function(err,result){
		if(err){
			throw err;
			return;
		}
		if(!result)
			return;
		else{
			result = JSON.parse(result);
			callback(result);	
		}
				
	});	
}
table.getProfile = function(studentId, callback){
    queryProfile(studentId, function(profile){
    callback(profile);
    });
}
table.getPass = function(studentId, callback){
    queryPass(studentId, function(pass){
	callback(pass);
    });
}
table.getCourse = function(studentId, callback){
    queryCourse(studentId, function(course){
	callback(course);
    });
}
table.getRule = function(studentId, callback){
    queryRule(studentId, function(rules){
        callback(rules);
    });
}
table.getList = function(studentId, callback){
    queryList(studentId, function(list){
	callback(list);
    });
}
table.getFree = function(studentId, callback){
    queryFree(studentId, function(free){
	callback(free);
    });
}
table.getNow = function(studentId, callback){
    queryNow(studentId, function(now){
        callback(now);
    });
}
table.getGeneral = function(callback){
    queryGeneral(function(general){
        callback(general);
    });
}
table.getChange = function(studentId, callback){
    queryChange(studentId, function(change){
        callback(change);
    });
}
table.getProject = function(studentId, callback){
    queryProject(studentId, function(project){
        callback(project);
    });
}
table.getProInfoAndResearchCount = function(studentId, callback){
    queryProInfoAndResearchCount(studentId ,function(info){
        callback(info);
    });
}
table.getCheckStateAndCreateNewForm = function(info, callback){
    CheckStateAndCreateNewForm(info ,function(signal){
        callback(signal);
    });
}
table.getApplyForm = function(studentId, callback){
    queryApplyForm(studentId ,function(form){
        callback(form);
    });
}
table.DeleteForm = function(info, callback){
    PerformDelete(info ,function(signal){
        callback(signal);
    });
}
table.EditProjectPage = function(info, callback){
    PerformEditProjectPage(info ,function(signal){
        callback(signal);
    });
}
table.getMentorInfo = function(studentId, callback){
    queryMentorInfo(studentId, function(info){
        callback(info);
    });
}
table.setScore = function(info, callback){
    SetProjectScore(info, function(signal){
        callback(signal);
    });
}
table.setTitle = function(info, callback){
    SetProjectTitle(info, function(signal){
        callback(signal);
    });
}
table.getProjectApplyList = function(teacherId, callback){
    queryProjectApplyList(teacherId, function(groups){
        callback(groups);
    });
}
table.getProjectList = function(teacherId, callback){
    queryProjectList(teacherId, function(projects){
        callback(projects);
    });
}
table.SetState = function(info, callback){
    SetApplyFormState(info, function(signal){
        callback(signal);
    });
}
table.getResearchIntro = function(info, callback){
    queryResearchIntro(info, function(intro){
        callback(intro);
    });
}
exports.tables = table;

