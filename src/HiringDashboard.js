import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Gift, Upload, Plus, Copy } from 'lucide-react';

const HiringDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobIndex, setSelectedJobIndex] = useState(null);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [currentCandidate, setCurrentCandidate] = useState({
    name: '',
    resumeContent: '',
    scores: {
      retailExperience: 0,
      guestService: 0,
      flexibility: 0,
      teamwork: 0,
      communication: 0,
      initiative: 0,
      productKnowledge: 0,
      technicalSkills: 0,
      physicalRequirements: 0,
      professionalism: 0
    }
  });

  const weights = {
    retailExperience: 2.5,
    guestService: 2.0,
    flexibility: 1.5,
    teamwork: 1.5,
    communication: 1.5,
    initiative: 1.0,
    productKnowledge: 1.0,
    technicalSkills: 1.0,
    physicalRequirements: 1.0,
    professionalism: 1.5
  };

  const interviewQuestions = [
    "Can you describe a time when you went above and beyond to ensure a customer had a positive experience?",
    "How do you stay organized and manage your time effectively in a fast-paced retail environment?",
    "Tell me about a situation where you had to work as part of a team to solve a problem or complete a task.",
    "How do you handle difficult or upset customers?",
    "What strategies do you use to stay up-to-date with product knowledge and current promotions?",
    "Can you give an example of how you've adapted to unexpected changes in your work environment?",
    "Describe a situation where you had to multitask. How did you prioritize your responsibilities?",
    "What do you know about The Paper Store, and why are you interested in working with us?"
  ];

  const handleScoreChange = (category, value) => {
    setCurrentCandidate(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [category]: value[0]
      }
    }));
  };

  const calculateTotalScore = (candidateScores) => {
    const weightedScores = Object.entries(candidateScores).reduce((acc, [category, score]) => {
      acc[category] = score * weights[category];
      return acc;
    }, {});
    const totalScore = Object.values(weightedScores).reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = Object.values(weights).reduce((sum, weight) => sum + weight * 10, 0);
    return (totalScore / maxPossibleScore * 100).toFixed(2);
  };

  const handleFileUpload = (event, setter) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setter(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleBulkJobUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const jobEntries = content.split('\n\n');
        const newJobs = jobEntries.map(entry => {
          const [title, ...descriptionLines] = entry.split('\n');
          return { title: title.trim(), description: descriptionLines.join('\n').trim(), candidates: [] };
        });
        setJobs(prevJobs => [...prevJobs, ...newJobs]);
      };
      reader.readAsText(file);
    }
  };

  const addJob = () => {
    if (newJobTitle && newJobDescription) {
      setJobs(prevJobs => [...prevJobs, { title: newJobTitle, description: newJobDescription, candidates: [] }]);
      setNewJobTitle('');
      setNewJobDescription('');
    } else {
      alert("Please enter both job title and description.");
    }
  };

  const addCandidate = () => {
    if (selectedJobIndex !== null && currentCandidate.name) {
      setJobs(prevJobs => {
        const updatedJobs = [...prevJobs];
        updatedJobs[selectedJobIndex].candidates.push({
          ...currentCandidate,
          totalScore: calculateTotalScore(currentCandidate.scores)
        });
        return updatedJobs;
      });
      setCurrentCandidate({
        name: '',
        resumeContent: '',
        scores: Object.fromEntries(Object.keys(weights).map(key => [key, 0]))
      });
    } else {
      alert("Please select a job and enter candidate name before adding.");
    }
  };

  const rankCandidates = (jobIndex) => {
    return jobs[jobIndex].candidates.sort((a, b) => b.totalScore - a.totalScore);
  };

  const generateEmailDraft = (candidate, job) => `
Dear ${candidate.name},

We are thrilled to inform you that we were impressed by your application for the ${job.title} position at The Paper Store. Your experience and qualifications align well with what we're looking for in this role.

We would like to invite you to the next stage of our hiring process. This will involve an in-person interview at our [Store Location] where you'll have the opportunity to meet our team and learn more about the role.

During the interview, we'll discuss your retail experience, customer service approach, and how you align with our company values. We're particularly interested in hearing about your experience with [specific aspect related to the role].

Please let us know your availability for the upcoming week, and we'll schedule a time that works best for you.

If you have any questions or need any additional information before the interview, please don't hesitate to reach out.

We look forward to meeting you and exploring how you can contribute to The Paper Store team!

Best regards,
[Your Name]
Hiring Manager, The Paper Store
  `;

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white text-gray-800 font-serif">
      <div className="flex items-center justify-center mb-6">
        <Gift className="w-8 h-8 mr-2" />
        <h1 className="text-3xl font-normal">the paper store</h1>
      </div>
      <h2 className="text-2xl font-normal mb-4 text-center">Comprehensive Multi-Job Hiring Dashboard</h2>
      
      {/* Job Management Section */}
      <Card className="mb-4 border-gray-300">
        <CardHeader className="bg-blue-100">
          <CardTitle className="text-xl font-normal">Job Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input
              type="text"
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
              placeholder="Enter job title"
              className="w-full p-2 border rounded border-gray-300 mb-2"
            />
            <Textarea 
              value={newJobDescription}
              onChange={(e) => setNewJobDescription(e.target.value)}
              placeholder="Enter job description"
              className="w-full h-32 mb-2"
            />
            <Button onClick={addJob} className="bg-green-600 hover:bg-green-700 text-white mr-2">
              <Plus className="mr-2 h-4 w-4" /> Add Single Job
            </Button>
            <Button 
              onClick={() => document.getElementById('bulkJobUpload').click()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="mr-2 h-4 w-4" /> Bulk Upload Jobs
            </Button>
            <input
              type="file"
              id="bulkJobUpload"
              className="hidden"
              onChange={handleBulkJobUpload}
            />
          </div>
          <div className="mt-4">
            <h3 className="font-bold mb-2">Available Jobs:</h3>
            {jobs.map((job, index) => (
              <div 
                key={index} 
                className={`p-2 mb-2 cursor-pointer ${selectedJobIndex === index ? 'bg-blue-200' : 'bg-gray-100'}`}
                onClick={() => setSelectedJobIndex(index)}
              >
                {job.title}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedJobIndex !== null && (
        <>
          {/* Selected Job Details */}
          <Card className="mb-4 border-gray-300">
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-xl font-normal">Selected Job: {jobs[selectedJobIndex].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-bold mb-2">Job Description:</h3>
              <p>{jobs[selectedJobIndex].description}</p>
            </CardContent>
          </Card>

          {/* Current Candidate Evaluation Card */}
          <Card className="mb-4 border-gray-300">
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-xl font-normal">Current Candidate Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Candidate Name</label>
                <input
                  type="text"
                  value={currentCandidate.name}
                  onChange={(e) => setCurrentCandidate(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded border-gray-300"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Resume</label>
                <Textarea 
                  value={currentCandidate.resumeContent}
                  onChange={(e) => setCurrentCandidate(prev => ({ ...prev, resumeContent: e.target.value }))}
                  placeholder="Paste resume content here..."
                  className="w-full h-32 mb-2"
                />
                <Button 
                  onClick={() => document.getElementById('resumeUpload').click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Resume
                </Button>
                <input
                  type="file"
                  id="resumeUpload"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, (content) => setCurrentCandidate(prev => ({ ...prev, resumeContent: content })))}
                />
              </div>
              {Object.entries(currentCandidate.scores).map(([category, score]) => (
                <div key={category} className="mb-4">
                  <label className="block mb-2 font-medium">
                    {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')} (Weight: {weights[category]})
                  </label>
                  <Slider
                    value={[score]}
                    onValueChange={(value) => handleScoreChange(category, value)}
                    max={10}
                    step={1}
                    className="bg-blue-200"
                  />
                  <span className="mt-1 block text-sm">{score} / 10</span>
                </div>
              ))}
              <Button onClick={addCandidate} className="mt-4 bg-green-600 hover:bg-green-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Candidate
              </Button>
            </CardContent>
          </Card>

          {/* Candidate Rankings Card */}
          <Card className="mb-4 border-gray-300">
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-xl font-normal">Candidate Rankings for {jobs[selectedJobIndex].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Rank</th>
                    <th className="text-left">Name</th>
                    <th className="text-left">Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rankCandidates(selectedJobIndex).map((candidate, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                      <td>{index + 1}</td>
                      <td>{candidate.name}</td>
                      <td>{candidate.totalScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Interview Questions Card */}
          <Card className="mb-4 border-gray-300">
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-xl font-normal">Interview Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside">
                {interviewQuestions.map((question, index) => (
                  <li key={index} className="mb-2">{question}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Outreach Email Draft Card */}
          <Card className="mb-4 border-gray-300">
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-xl font-normal">Outreach Email Draft</CardTitle>
            </CardHeader>
            <CardContent>
              {jobs[selectedJobIndex].candidates.length > 0 ? (
                <>
                  <Textarea
                    value={generateEmailDraft(jobs[selectedJobIndex].candidates[0], jobs[selectedJobIndex])}
                    readOnly
                    className="w-full h-64 border-gray-300 mb-2"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Copy className="mr-2 h-4 w-4" /> Copy Email Draft
                  </Button>
                </>
              ) : (
                <p>Add candidates to generate an email draft.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default HiringDashboard;