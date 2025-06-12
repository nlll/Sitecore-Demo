using Newtonsoft.Json.Linq;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.LayoutService.Configuration;
using Sitecore.LayoutService.ItemRendering.ContentsResolvers;
using Sitecore.Mvc.Presentation;
using System.Collections.Generic;
using System.Linq;

namespace XmCloudSXAStarter.RenderingContentResolvers
{
    public class ItemAndChildrenResolverTest : RenderingContentsResolver
    {
        public override object ResolveContents(Rendering rendering, IRenderingConfiguration renderingConfig)
        {
            //check if the parameters are not null
            Assert.ArgumentNotNull(rendering, nameof(rendering));
            Assert.ArgumentNotNull(renderingConfig, nameof(renderingConfig));

            //get the datasource item
            Item datasourceItem = this.GetContextItem(rendering, renderingConfig);

            //return null object if the datasourceItem is null
            if (datasourceItem == null)
            {
                return null;
            }

            //initialize the JSON object to be returned with the datasourceItem details 
            JObject jobject = ProcessItem(datasourceItem, rendering, renderingConfig);

            //get the children of the datasourceItem
            IEnumerable<Item> items = GetItems(datasourceItem);
            List<Item> itemList = items != null ? items.ToList() : null;

            JArray children = GetChildren(itemList, rendering, renderingConfig);

            if (children != null)
            {
                jobject["childItems"] = children;
            }

            return jobject;
        }

        private JArray GetChildren(List<Item> itemList, Rendering rendering, IRenderingConfiguration renderingConfig)
        {
            //return the JSON object if children do not exist
            if (itemList == null || itemList.Count == 0)
            {
                return null;
            }

            JArray children = ProcessItems(itemList, rendering, renderingConfig);

            //then parse the list to get those children
            int index = 0;
            foreach (Item item in itemList)
            {
                children[index]["templateId"] = item.TemplateID.ToString();

                IEnumerable<Item> items = GetItems(item);
                List<Item> childList = items != null ? items.ToList() : null;

                JArray childLinks = GetChildren(childList, rendering, renderingConfig);

                if (childLinks != null)
                {
                    children[index]["childItems"] = childLinks;
                }
                index++;
            }
            return children;
        }
    }
}