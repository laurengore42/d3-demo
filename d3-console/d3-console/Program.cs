using Octokit;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace d3_console
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var clientId = ConfigurationManager.AppSettings["ClientId"];
            var clientSecret = ConfigurationManager.AppSettings["ClientSecret"];

            var client = new GitHubClient(new ProductHeaderValue("d3-demo"))
            {
                Credentials = new Credentials(clientId, clientSecret)
            };

            Console.WriteLine("Retrieving GitHub data...");

            var apiRepoList = await client.Repository.GetAllForOrg(ConfigurationManager.AppSettings["OrgName"]);
            var repos = new List<RepoWithContribs>();
            foreach (var repo in apiRepoList)
            {
                var apiContribList = await client.Repository.GetAllContributors(repo.Id);
                repos.Add(new RepoWithContribs
                {
                    Repo = repo,
                    Contribs = from c in apiContribList orderby c.Contributions select c
                });
            }

            Console.WriteLine("Writing to CSV...");

            var csv = new StringBuilder();
            csv.AppendLine(string.Format("{0},{1},{2}", "Repo", "Login", "Contributions"));
            foreach (var r in repos)
            {
                foreach (var c in r.Contribs)
                {
                    csv.AppendLine(string.Format("{0},{1},{2}", r.Repo.Name, c.Login, c.Contributions));
                }
            }
            File.WriteAllText("githubdata.csv", csv.ToString());
            
            Console.WriteLine("Done.");
            Console.ReadLine();
        }
    }

    public class RepoWithContribs
    {
        public Repository Repo;
        public IEnumerable<RepositoryContributor> Contribs;
    }
}
